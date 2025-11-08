import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Check if git is installed
 */
export async function isGitInstalled(): Promise<boolean> {
  try {
    await execAsync('git --version');
    return true;
  } catch {
    return false;
  }
}

/**
 * Get current global git configuration
 */
export async function getGlobalGitConfig(): Promise<{ name: string; email: string }> {
  try {
    const { stdout: name } = await execAsync('git config --global user.name');
    const { stdout: email } = await execAsync('git config --global user.email');
    return {
      name: name.trim(),
      email: email.trim(),
    };
  } catch {
    return { name: '', email: '' };
  }
}

/**
 * Set global git user name
 */
export async function setGlobalGitName(name: string): Promise<void> {
  await execAsync(`git config --global user.name "${name}"`);
}

/**
 * Set global git user email
 */
export async function setGlobalGitEmail(email: string): Promise<void> {
  await execAsync(`git config --global user.email "${email}"`);
}

/**
 * Set local git configuration for a repository
 */
export async function setLocalGitConfig(
  repoPath: string,
  name: string,
  email: string
): Promise<void> {
  await execAsync(`git config user.name "${name}"`, { cwd: repoPath });
  await execAsync(`git config user.email "${email}"`, { cwd: repoPath });
}

/**
 * Clone a repository using a specific SSH host
 */
export async function cloneRepo(
  repoUrl: string,
  sshHost: string,
  destPath?: string
): Promise<string> {
  // Rewrite the URL to use the SSH host alias
  const rewrittenUrl = rewriteGitURL(repoUrl, sshHost);

  const cloneCmd = destPath
    ? `git clone ${rewrittenUrl} "${destPath}"`
    : `git clone ${rewrittenUrl}`;

  await execAsync(cloneCmd);

  // Extract the directory name from the URL if destPath wasn't provided
  if (!destPath) {
    const match = repoUrl.match(/\/([^\/]+?)(\.git)?$/);
    destPath = match ? match[1] : '';
  }

  return destPath;
}

/**
 * Rewrite a GitHub URL to use a specific SSH host alias
 */
export function rewriteGitURL(url: string, sshHost: string): string {
  // Handle HTTPS URLs
  if (url.startsWith('https://github.com/')) {
    const repo = url.replace('https://github.com/', '');
    return `git@${sshHost}:${repo}`;
  }

  // Handle SSH URLs
  if (url.startsWith('git@github.com:')) {
    return url.replace('github.com', sshHost);
  }

  // Handle git:// URLs
  if (url.startsWith('git://github.com/')) {
    const repo = url.replace('git://github.com/', '');
    return `git@${sshHost}:${repo}`;
  }

  // If it's already using an alias, return as-is
  return url;
}

/**
 * Test SSH connection to GitHub
 */
export async function testSSHConnection(sshHost: string): Promise<{ success: boolean; message: string }> {
  try {
    // SSH to GitHub always returns exit code 1, but with a success message
    const { stderr } = await execAsync(`ssh -T git@${sshHost} -o StrictHostKeyChecking=no`, {
      timeout: 10000,
    });

    // GitHub's SSH returns the message in stderr
    if (stderr.includes('successfully authenticated')) {
      return {
        success: true,
        message: stderr.trim(),
      };
    }

    return {
      success: false,
      message: stderr.trim() || 'Connection failed',
    };
  } catch (error: any) {
    // GitHub SSH always exits with code 1, so we check the message
    if (error.stderr && error.stderr.includes('successfully authenticated')) {
      return {
        success: true,
        message: error.stderr.trim(),
      };
    }

    return {
      success: false,
      message: error.stderr?.trim() || error.message || 'Connection failed',
    };
  }
}
