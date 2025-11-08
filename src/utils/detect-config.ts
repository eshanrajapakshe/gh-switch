import * as fs from 'fs-extra';
import * as path from 'path';
import { getSSHDir } from './file-operations';
import { getGlobalGitConfig } from './git-operations';

/**
 * Detected SSH key information
 */
export interface DetectedSSHKey {
  path: string;
  name: string;
  hasPublicKey: boolean;
}

/**
 * Detected Git configuration
 */
export interface DetectedGitConfig {
  name: string;
  email: string;
}

/**
 * Scan for SSH keys in the .ssh directory
 */
export async function detectSSHKeys(): Promise<DetectedSSHKey[]> {
  const sshDir = getSSHDir();
  const keys: DetectedSSHKey[] = [];

  try {
    const files = await fs.readdir(sshDir);

    // Common SSH key patterns
    const keyPatterns = [
      /^id_rsa$/,
      /^id_rsa_.+$/,
      /^id_ed25519$/,
      /^id_ed25519_.+$/,
      /^id_ecdsa$/,
      /^id_ecdsa_.+$/,
      /^id_dsa$/,
      /^id_dsa_.+$/,
    ];

    for (const file of files) {
      // Skip .pub files
      if (file.endsWith('.pub')) continue;

      // Check if file matches SSH key pattern
      const matchesPattern = keyPatterns.some((pattern) => pattern.test(file));

      if (matchesPattern) {
        const keyPath = path.join(sshDir, file);
        const pubKeyPath = `${keyPath}.pub`;

        // Verify it's a file (not a directory)
        const stats = await fs.stat(keyPath);
        if (!stats.isFile()) continue;

        const hasPublicKey = await fs.pathExists(pubKeyPath);

        keys.push({
          path: keyPath,
          name: file,
          hasPublicKey,
        });
      }
    }

    // Sort by common naming conventions (id_ed25519 first, then id_rsa)
    keys.sort((a, b) => {
      if (a.name.startsWith('id_ed25519') && !b.name.startsWith('id_ed25519'))
        return -1;
      if (!a.name.startsWith('id_ed25519') && b.name.startsWith('id_ed25519'))
        return 1;
      if (a.name.startsWith('id_rsa') && !b.name.startsWith('id_rsa')) return -1;
      if (!a.name.startsWith('id_rsa') && b.name.startsWith('id_rsa')) return 1;
      return a.name.localeCompare(b.name);
    });

    return keys;
  } catch (error) {
    // SSH directory doesn't exist or can't be read
    return [];
  }
}

/**
 * Get the default SSH key to suggest
 */
export async function getDefaultSSHKey(): Promise<string | null> {
  const keys = await detectSSHKeys();

  if (keys.length === 0) {
    return null;
  }

  // Prefer keys with public keys
  const keyWithPub = keys.find((k) => k.hasPublicKey);
  if (keyWithPub) {
    return keyWithPub.path;
  }

  // Otherwise return the first key
  return keys[0].path;
}

/**
 * Detect current Git configuration
 */
export async function detectGitConfig(): Promise<DetectedGitConfig | null> {
  try {
    const config = await getGlobalGitConfig();

    if (config.name && config.email) {
      return {
        name: config.name,
        email: config.email,
      };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Check if Git configuration is already set up
 */
export async function hasExistingGitConfig(): Promise<boolean> {
  const config = await detectGitConfig();
  return config !== null && config.name !== '' && config.email !== '';
}
