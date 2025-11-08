import { Config, Profile } from '../types';
import {
  getConfigDir,
  getConfigPath,
  ensureDir,
  fileExists,
  readJSON,
  writeJSON,
} from '../utils/file-operations';

const CONFIG_VERSION = '1.0.0';

/**
 * Initialize default configuration
 */
function getDefaultConfig(): Config {
  return {
    profiles: [],
    activeProfile: null,
    version: CONFIG_VERSION,
  };
}

/**
 * Load configuration from file
 */
export async function loadConfig(): Promise<Config> {
  const configPath = getConfigPath();

  if (!(await fileExists(configPath))) {
    return getDefaultConfig();
  }

  try {
    const config = await readJSON<Config>(configPath);
    return config;
  } catch (error) {
    throw new Error(`Failed to load configuration: ${error}`);
  }
}

/**
 * Save configuration to file
 */
export async function saveConfig(config: Config): Promise<void> {
  const configDir = getConfigDir();
  const configPath = getConfigPath();

  await ensureDir(configDir);
  await writeJSON(configPath, config);
}

/**
 * Add a new profile to configuration
 */
export async function addProfile(profile: Profile): Promise<void> {
  const config = await loadConfig();

  // Check if profile with same name already exists
  const existingIndex = config.profiles.findIndex((p) => p.name === profile.name);

  if (existingIndex !== -1) {
    // Update existing profile
    config.profiles[existingIndex] = profile;
  } else {
    // Add new profile
    config.profiles.push(profile);
  }

  // If this is the first profile, set it as active
  if (config.profiles.length === 1) {
    config.activeProfile = profile.name;
  }

  await saveConfig(config);
}

/**
 * Remove a profile from configuration
 */
export async function removeProfile(profileName: string): Promise<void> {
  const config = await loadConfig();

  const index = config.profiles.findIndex((p) => p.name === profileName);

  if (index === -1) {
    throw new Error(`Profile "${profileName}" not found`);
  }

  config.profiles.splice(index, 1);

  // If removed profile was active, clear active profile
  if (config.activeProfile === profileName) {
    config.activeProfile = config.profiles.length > 0 ? config.profiles[0].name : null;
  }

  await saveConfig(config);
}

/**
 * Get a profile by name
 */
export async function getProfile(profileName: string): Promise<Profile | null> {
  const config = await loadConfig();
  return config.profiles.find((p) => p.name === profileName) || null;
}

/**
 * Get all profiles
 */
export async function getAllProfiles(): Promise<Profile[]> {
  const config = await loadConfig();
  return config.profiles;
}

/**
 * Get active profile
 */
export async function getActiveProfile(): Promise<Profile | null> {
  const config = await loadConfig();

  if (!config.activeProfile) {
    return null;
  }

  return config.profiles.find((p) => p.name === config.activeProfile) || null;
}

/**
 * Set active profile
 */
export async function setActiveProfile(profileName: string): Promise<void> {
  const config = await loadConfig();

  const profile = config.profiles.find((p) => p.name === profileName);

  if (!profile) {
    throw new Error(`Profile "${profileName}" not found`);
  }

  config.activeProfile = profileName;
  await saveConfig(config);
}

/**
 * Check if a profile exists
 */
export async function profileExists(profileName: string): Promise<boolean> {
  const config = await loadConfig();
  return config.profiles.some((p) => p.name === profileName);
}

/**
 * Get configuration file path for display
 */
export function getConfigFilePath(): string {
  return getConfigPath();
}

/**
 * Check if an SSH key is already used by another profile
 */
export async function isSSHKeyInUse(
  sshKeyPath: string,
  excludeProfileName?: string
): Promise<{ inUse: boolean; profileName?: string }> {
  const config = await loadConfig();

  const profile = config.profiles.find(
    (p) => p.sshKeyPath === sshKeyPath && p.name !== excludeProfileName
  );

  if (profile) {
    return {
      inUse: true,
      profileName: profile.name,
    };
  }

  return { inUse: false };
}
