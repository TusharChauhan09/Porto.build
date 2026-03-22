import prisma from "@/lib/db";

export class VercelAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VercelAuthError";
  }
}

/**
 * Retrieve the Vercel access token and teamId for a user.
 * Returns null if the user has no linked Vercel account.
 */
export async function getVercelToken(
  userId: string
): Promise<{ token: string; teamId: string | null } | null> {
  const account = await prisma.vercelAccount.findUnique({
    where: { userId },
  });
  if (!account) return null;
  return { token: account.accessToken, teamId: account.teamId };
}

/**
 * Create a Vercel deployment with inline files.
 * The files Map is the same format returned by getFilesFromTemplate / getFilesFromSandbox.
 */
export async function createVercelDeployment(
  token: string,
  projectName: string,
  files: Map<string, string>,
  teamId?: string | null
): Promise<{ deploymentId: string; url: string; projectId: string }> {
  const vercelFiles = Array.from(files.entries()).map(([filePath, content]) => ({
    file: filePath,
    data: content,
    encoding: "utf-8" as const,
  }));

  const url = teamId
    ? `https://api.vercel.com/v13/deployments?teamId=${teamId}&skipAutoDetectionConfirmation=1`
    : `https://api.vercel.com/v13/deployments?skipAutoDetectionConfirmation=1`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: projectName,
      target: "production",
      projectSettings: {
        framework: "nextjs",
        buildCommand: "npm run build",
        installCommand: "npm install",
        nodeVersion: "20.x",
      },
      files: vercelFiles,
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    if (res.status === 401 || res.status === 403) {
      throw new VercelAuthError("Vercel token expired or revoked");
    }
    throw new Error(
      error.error?.message || `Deployment failed (${res.status})`
    );
  }

  const data = await res.json();
  return {
    deploymentId: data.id,
    url: data.url,
    projectId: data.projectId || "",
  };
}

/**
 * Check the status of a Vercel deployment.
 * readyState: QUEUED | BUILDING | INITIALIZING | READY | ERROR | CANCELED
 */
export async function getDeploymentStatus(
  token: string,
  deploymentId: string,
  teamId?: string | null
): Promise<{ readyState: string; url: string; alias: string[] }> {
  const url = teamId
    ? `https://api.vercel.com/v13/deployments/${deploymentId}?teamId=${teamId}`
    : `https://api.vercel.com/v13/deployments/${deploymentId}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new VercelAuthError("Vercel token expired or revoked");
    }
    throw new Error(`Failed to check deployment status (${res.status})`);
  }

  const data = await res.json();
  return {
    readyState: data.readyState,
    url: data.url,
    alias: data.alias || [],
  };
}
