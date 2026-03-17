import { Sandbox } from "e2b";

interface SandboxInfo {
  sandbox: Sandbox;
  sandboxId: string;
  previewUrl: string;
  userId: string;
}

// Primary index: userId -> SandboxInfo (enforces 1 sandbox per user)
const userSandboxes = new Map<string, SandboxInfo>();

// Secondary index: sandboxId -> SandboxInfo (fast lookup by ID)
const sandboxById = new Map<string, SandboxInfo>();

/**
 * Create a new sandbox for a user. Kills any existing sandbox for this user first.
 */
export async function createSandbox(userId: string): Promise<{
  sandboxId: string;
  previewUrl: string;
}> {
  // Kill existing sandbox for this user (enforce 1-per-user limit)
  const existing = userSandboxes.get(userId);
  if (existing) {
    try {
      await existing.sandbox.kill();
    } catch {
      // Sandbox may have already expired — ignore
    }
    sandboxById.delete(existing.sandboxId);
    userSandboxes.delete(userId);
  }

  const sandbox = await Sandbox.create("nextjs-16-1-6-app", {
    apiKey: process.env.E2B_API_KEY,
    timeoutMs: 30 * 60 * 1000, // 30 minutes
  });

  const host = sandbox.getHost(3000);
  const info: SandboxInfo = {
    sandbox,
    sandboxId: sandbox.sandboxId,
    previewUrl: `https://${host}`,
    userId,
  };

  userSandboxes.set(userId, info);
  sandboxById.set(sandbox.sandboxId, info);

  return {
    sandboxId: sandbox.sandboxId,
    previewUrl: info.previewUrl,
  };
}

/**
 * Get an existing sandbox by ID. Reconnects if the server restarted.
 */
export async function getSandbox(sandboxId: string): Promise<Sandbox> {
  const info = sandboxById.get(sandboxId);
  if (info) return info.sandbox;

  // Reconnect if not in cache (e.g., after server restart)
  const sandbox = await Sandbox.connect(sandboxId, {
    apiKey: process.env.E2B_API_KEY,
  });
  sandboxById.set(sandboxId, {
    sandbox,
    sandboxId,
    previewUrl: `https://${sandbox.getHost(3000)}`,
    userId: "", // unknown after reconnect
  });
  return sandbox;
}

/**
 * Kill a sandbox by ID and remove it from tracking.
 * Idempotent — safe to call multiple times for the same sandbox.
 */
export async function killSandbox(sandboxId: string): Promise<void> {
  const info = sandboxById.get(sandboxId);
  if (!info) return;

  try {
    await info.sandbox.kill();
  } catch {
    // Already dead — fine
  }

  sandboxById.delete(sandboxId);
  if (info.userId) {
    const current = userSandboxes.get(info.userId);
    // Only remove from userSandboxes if it's still the same sandbox
    if (current?.sandboxId === sandboxId) {
      userSandboxes.delete(info.userId);
    }
  }
}

/**
 * Get the userId that owns a sandbox, or null if unknown.
 */
export function getSandboxOwner(sandboxId: string): string | null {
  return sandboxById.get(sandboxId)?.userId ?? null;
}
