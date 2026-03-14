import { Sandbox } from "e2b";

// Cache sandbox instances so multiple API calls reuse the same sandbox
const sandboxes = new Map<string, Sandbox>();

export async function createSandbox(): Promise<{
  sandboxId: string;
  previewUrl: string;
}> {
  const sandbox = await Sandbox.create("nextjs-16-1-6-app", {
    apiKey: process.env.E2B_API_KEY,
    timeoutMs: 30 * 60 * 1000, // 30 minutes
  });

  sandboxes.set(sandbox.sandboxId, sandbox);

  const host = sandbox.getHost(3000);
  return {
    sandboxId: sandbox.sandboxId,
    previewUrl: `https://${host}`,
  };
}

export async function getSandbox(sandboxId: string): Promise<Sandbox> {
  let sandbox = sandboxes.get(sandboxId);
  if (!sandbox) {
    // Reconnect if not in cache (e.g., after server restart)
    sandbox = await Sandbox.connect(sandboxId, {
      apiKey: process.env.E2B_API_KEY,
    });
    sandboxes.set(sandboxId, sandbox);
  }
  return sandbox;
}
