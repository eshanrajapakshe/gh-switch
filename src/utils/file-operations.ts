import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';

/**
 * Get the configuration directory path
 */
export function getConfigDir(): string {
  return path.join(os.homedir(), '.gh-switch');
}

/**
 * Get the configuration file path
 */
export function getConfigPath(): string {
  return path.join(getConfigDir(), 'config.json');
}

/**
 * Get the SSH config file path
 */
export function getSSHConfigPath(): string {
  return path.join(os.homedir(), '.ssh', 'config');
}

/**
 * Get the SSH directory path
 */
export function getSSHDir(): string {
  return path.join(os.homedir(), '.ssh');
}

/**
 * Ensure a directory exists, create it if it doesn't
 */
export async function ensureDir(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath);
}

/**
 * Check if a file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Read a JSON file
 */
export async function readJSON<T>(filePath: string): Promise<T> {
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Write a JSON file
 */
export async function writeJSON(filePath: string, data: any): Promise<void> {
  await fs.writeJSON(filePath, data, { spaces: 2 });
}

/**
 * Backup a file by copying it with a .backup extension
 */
export async function backupFile(filePath: string): Promise<string> {
  const backupPath = `${filePath}.backup`;
  await fs.copy(filePath, backupPath);
  return backupPath;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Expand tilde in file paths to home directory
 */
export function expandTilde(filePath: string): string {
  if (filePath.startsWith('~/') || filePath === '~') {
    return path.join(os.homedir(), filePath.slice(1));
  }
  return filePath;
}

/**
 * Check if SSH key has correct permissions (Unix-like systems)
 */
export async function checkSSHKeyPermissions(keyPath: string): Promise<boolean> {
  if (process.platform === 'win32') {
    // Windows doesn't use the same permission model
    return true;
  }

  try {
    const stats = await fs.stat(keyPath);
    const mode = stats.mode & 0o777;
    // SSH keys should be 600 or 400
    return mode === 0o600 || mode === 0o400;
  } catch {
    return false;
  }
}

/**
 * Fix SSH key permissions (Unix-like systems)
 */
export async function fixSSHKeyPermissions(keyPath: string): Promise<void> {
  if (process.platform === 'win32') {
    return;
  }

  await fs.chmod(keyPath, 0o600);
}
