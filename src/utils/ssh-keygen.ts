import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs-extra';
import * as path from 'path';
import { getSSHDir } from './file-operations';

const execAsync = promisify(exec);

/**
 * Generate SSH key result
 */
export interface GenerateSSHKeyResult {
  privateKeyPath: string;
  publicKeyPath: string;
  publicKeyContent: string;
}

/**
 * Generate a new SSH key pair
 */
export async function generateSSHKey(
  email: string,
  keyName: string
): Promise<GenerateSSHKeyResult> {
  const sshDir = getSSHDir();
  const privateKeyPath = path.join(sshDir, keyName);
  const publicKeyPath = `${privateKeyPath}.pub`;

  // Ensure SSH directory exists
  await fs.ensureDir(sshDir);

  // Generate SSH key using ssh-keygen
  // -t ed25519: Use Ed25519 algorithm (more secure than RSA)
  // -C: Comment (usually email)
  // -f: Output file path
  // -N "": Empty passphrase
  const command = `ssh-keygen -t ed25519 -C "${email}" -f "${privateKeyPath}" -N ""`;

  try {
    await execAsync(command);

    // Read the public key content
    const publicKeyContent = await fs.readFile(publicKeyPath, 'utf-8');

    return {
      privateKeyPath,
      publicKeyPath,
      publicKeyContent: publicKeyContent.trim(),
    };
  } catch (error: any) {
    throw new Error(`Failed to generate SSH key: ${error.message}`);
  }
}

/**
 * Generate a unique SSH key name based on profile name
 */
export function generateSSHKeyName(profileName: string): string {
  const sanitized = profileName.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  return `id_ed25519_${sanitized}`;
}

/**
 * Read public key content from a private key path
 */
export async function readPublicKey(privateKeyPath: string): Promise<string | null> {
  const publicKeyPath = `${privateKeyPath}.pub`;

  try {
    if (await fs.pathExists(publicKeyPath)) {
      const content = await fs.readFile(publicKeyPath, 'utf-8');
      return content.trim();
    }
    return null;
  } catch {
    return null;
  }
}
