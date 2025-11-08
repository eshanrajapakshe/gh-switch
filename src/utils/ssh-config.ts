import * as fs from 'fs-extra';
import { SSHConfigEntry } from '../types';
import { getSSHConfigPath, getSSHDir, ensureDir, fileExists, backupFile } from './file-operations';

const GH_SWITCH_START_MARKER = '# --- gh-switch managed entries START ---';
const GH_SWITCH_END_MARKER = '# --- gh-switch managed entries END ---';

/**
 * Generate SSH host alias from profile name
 */
export function generateSSHHost(profileName: string): string {
  // Convert profile name to a valid SSH host alias
  const sanitized = profileName.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  return `github.com-${sanitized}`;
}

/**
 * Read SSH config file
 */
async function readSSHConfig(): Promise<string> {
  const sshConfigPath = getSSHConfigPath();

  if (!(await fileExists(sshConfigPath))) {
    return '';
  }

  return await fs.readFile(sshConfigPath, 'utf-8');
}

/**
 * Write SSH config file
 */
async function writeSSHConfig(content: string): Promise<void> {
  const sshConfigPath = getSSHConfigPath();
  const sshDir = getSSHDir();

  await ensureDir(sshDir);
  await fs.writeFile(sshConfigPath, content, { mode: 0o600 });
}

/**
 * Parse SSH config entry to string
 */
function formatSSHEntry(entry: SSHConfigEntry): string {
  const lines = [
    `Host ${entry.host}`,
    `  HostName ${entry.hostname}`,
    `  User ${entry.user}`,
    `  IdentityFile ${entry.identityFile}`,
  ];

  if (entry.identitiesOnly) {
    lines.push('  IdentitiesOnly yes');
  }

  return lines.join('\n');
}

/**
 * Extract gh-switch managed section and other content
 */
function splitSSHConfig(content: string): { managed: string; other: string } {
  const startIndex = content.indexOf(GH_SWITCH_START_MARKER);
  const endIndex = content.indexOf(GH_SWITCH_END_MARKER);

  if (startIndex === -1 || endIndex === -1) {
    return { managed: '', other: content };
  }

  const before = content.substring(0, startIndex).trim();
  const managed = content.substring(
    startIndex + GH_SWITCH_START_MARKER.length,
    endIndex
  ).trim();
  const after = content.substring(endIndex + GH_SWITCH_END_MARKER.length).trim();

  const other = [before, after].filter(Boolean).join('\n\n');

  return { managed, other };
}

/**
 * Add or update SSH config entry for a profile
 */
export async function addSSHConfigEntry(entry: SSHConfigEntry): Promise<void> {
  const sshConfigPath = getSSHConfigPath();

  // Backup existing config if it exists
  if (await fileExists(sshConfigPath)) {
    await backupFile(sshConfigPath);
  }

  const currentConfig = await readSSHConfig();
  const { managed, other } = splitSSHConfig(currentConfig);

  // Parse existing managed entries
  const managedEntries = parseManagedEntries(managed);

  // Remove existing entry for this host if it exists
  const filteredEntries = managedEntries.filter((e) => e.host !== entry.host);

  // Add new entry
  filteredEntries.push(entry);

  // Rebuild managed section
  const newManaged = filteredEntries.map(formatSSHEntry).join('\n\n');

  // Rebuild full config
  const parts = [];
  if (other) {
    parts.push(other);
  }
  parts.push(GH_SWITCH_START_MARKER);
  parts.push(newManaged);
  parts.push(GH_SWITCH_END_MARKER);

  const newConfig = parts.join('\n\n') + '\n';

  await writeSSHConfig(newConfig);
}

/**
 * Remove SSH config entry by host
 */
export async function removeSSHConfigEntry(host: string): Promise<void> {
  const sshConfigPath = getSSHConfigPath();

  if (!(await fileExists(sshConfigPath))) {
    return;
  }

  // Backup existing config
  await backupFile(sshConfigPath);

  const currentConfig = await readSSHConfig();
  const { managed, other } = splitSSHConfig(currentConfig);

  // Parse existing managed entries
  const managedEntries = parseManagedEntries(managed);

  // Remove entry for this host
  const filteredEntries = managedEntries.filter((e) => e.host !== host);

  if (filteredEntries.length === 0) {
    // If no managed entries left, just keep the other content
    await writeSSHConfig(other ? other + '\n' : '');
    return;
  }

  // Rebuild managed section
  const newManaged = filteredEntries.map(formatSSHEntry).join('\n\n');

  // Rebuild full config
  const parts = [];
  if (other) {
    parts.push(other);
  }
  parts.push(GH_SWITCH_START_MARKER);
  parts.push(newManaged);
  parts.push(GH_SWITCH_END_MARKER);

  const newConfig = parts.join('\n\n') + '\n';

  await writeSSHConfig(newConfig);
}

/**
 * Parse managed entries from the managed section
 */
function parseManagedEntries(managed: string): SSHConfigEntry[] {
  if (!managed.trim()) {
    return [];
  }

  const entries: SSHConfigEntry[] = [];
  const blocks = managed.split(/\n\s*\n/); // Split by blank lines

  for (const block of blocks) {
    const lines = block.trim().split('\n');
    if (lines.length === 0) continue;

    const entry: Partial<SSHConfigEntry> = {
      identitiesOnly: false,
    };

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('Host ')) {
        entry.host = trimmed.substring(5).trim();
      } else if (trimmed.startsWith('HostName ')) {
        entry.hostname = trimmed.substring(9).trim();
      } else if (trimmed.startsWith('User ')) {
        entry.user = trimmed.substring(5).trim();
      } else if (trimmed.startsWith('IdentityFile ')) {
        entry.identityFile = trimmed.substring(13).trim();
      } else if (trimmed.startsWith('IdentitiesOnly ')) {
        entry.identitiesOnly = trimmed.substring(15).trim().toLowerCase() === 'yes';
      }
    }

    if (entry.host && entry.hostname && entry.user && entry.identityFile) {
      entries.push(entry as SSHConfigEntry);
    }
  }

  return entries;
}

/**
 * Create SSH config entry from profile data
 */
export function createSSHConfigEntry(
  sshHost: string,
  sshKeyPath: string
): SSHConfigEntry {
  return {
    host: sshHost,
    hostname: 'github.com',
    user: 'git',
    identityFile: sshKeyPath,
    identitiesOnly: true,
  };
}
