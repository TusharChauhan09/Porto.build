import { Octokit } from "@octokit/rest";
import prisma from "@/lib/db";

/**
 * Retrieve the GitHub access token for a user from the Account table.
 * Returns null if the user has no linked GitHub account.
 */
export async function getGitHubToken(userId: string): Promise<string | null> {
  const account = await prisma.account.findFirst({
    where: {
      userId,
      providerId: "github",
    },
  });
  return account?.accessToken ?? null;
}

/**
 * Create a new GitHub repository under the authenticated user.
 */
export async function createGitHubRepo(
  token: string,
  repoName: string,
  isPrivate: boolean
): Promise<{ owner: string; repo: string; url: string }> {
  const octokit = new Octokit({ auth: token });

  const { data: user } = await octokit.users.getAuthenticated();

  const { data: repo } = await octokit.repos.createForAuthenticatedUser({
    name: repoName,
    private: isPrivate,
    auto_init: true,
    description: "Portfolio site built with Porto.build",
  });

  return {
    owner: user.login,
    repo: repo.name,
    url: repo.html_url,
  };
}

/**
 * Push multiple files to a GitHub repo in a single commit using the Git Data API.
 * Requires auto_init: true on repo creation so `heads/main` exists.
 */
export async function pushFilesToRepo(
  token: string,
  owner: string,
  repo: string,
  files: Map<string, string>,
  commitMessage: string = "Initial portfolio deployment from Porto.build"
): Promise<string> {
  const octokit = new Octokit({ auth: token });

  // 1. Get the current commit SHA on main
  const { data: ref } = await octokit.git.getRef({
    owner,
    repo,
    ref: "heads/main",
  });
  const parentCommitSha = ref.object.sha;

  const { data: parentCommit } = await octokit.git.getCommit({
    owner,
    repo,
    commit_sha: parentCommitSha,
  });
  const baseTreeSha = parentCommit.tree.sha;

  // 2. Create blobs for each file in parallel
  const blobPromises = Array.from(files.entries()).map(
    async ([path, content]) => {
      const { data: blob } = await octokit.git.createBlob({
        owner,
        repo,
        content,
        encoding: "utf-8",
      });
      return { path, sha: blob.sha };
    }
  );
  const blobs = await Promise.all(blobPromises);

  // 3. Create a new tree with all files
  const { data: tree } = await octokit.git.createTree({
    owner,
    repo,
    base_tree: baseTreeSha,
    tree: blobs.map(({ path, sha }) => ({
      path,
      mode: "100644" as const,
      type: "blob" as const,
      sha,
    })),
  });

  // 4. Create a new commit pointing to the tree
  const { data: commit } = await octokit.git.createCommit({
    owner,
    repo,
    message: commitMessage,
    tree: tree.sha,
    parents: [parentCommitSha],
  });

  // 5. Update main branch to the new commit
  await octokit.git.updateRef({
    owner,
    repo,
    ref: "heads/main",
    sha: commit.sha,
  });

  return commit.sha;
}
