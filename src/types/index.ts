/**
 * Represents a GitHub account profile
 */
export interface Profile {
  /** Unique profile name/identifier */
  name: string;
  /** Git user.name */
  gitName: string;
  /** Git user.email */
  gitEmail: string;
  /** GitHub username */
  githubUsername: string;
  /** Path to SSH private key */
  sshKeyPath: string;
  /** SSH host alias (e.g., github.com-work) */
  sshHost: string;
}

/**
 * Application configuration structure
 */
export interface Config {
  /** All configured profiles */
  profiles: Profile[];
  /** Currently active profile name */
  activeProfile: string | null;
  /** Configuration version for future migrations */
  version: string;
}

/**
 * SSH config entry
 */
export interface SSHConfigEntry {
  host: string;
  hostname: string;
  user: string;
  identityFile: string;
  identitiesOnly: boolean;
}

/**
 * Result of SSH verification
 */
export interface VerifyResult {
  profileName: string;
  success: boolean;
  message: string;
}
