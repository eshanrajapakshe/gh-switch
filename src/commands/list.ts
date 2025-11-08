import chalk from 'chalk';
import { getAllProfiles, getActiveProfile } from '../config/config-manager';

export async function listCommand(): Promise<void> {
  const profiles = await getAllProfiles();
  const activeProfile = await getActiveProfile();

  if (profiles.length === 0) {
    console.log(chalk.yellow('\n⚠️  No profiles configured yet.'));
    console.log(chalk.cyan('Run "gh-switch init" to add your first profile.\n'));
    return;
  }

  console.log(chalk.blue.bold(`\n📋 GitHub Account Profiles (${profiles.length})\n`));

  for (const profile of profiles) {
    const isActive = activeProfile?.name === profile.name;
    const marker = isActive ? chalk.green('● ') : '  ';
    const nameColor = isActive ? chalk.green.bold : chalk.white;

    console.log(`${marker}${nameColor(profile.name)}`);
    console.log(`    GitHub: ${chalk.cyan(profile.githubUsername)}`);
    console.log(`    Email: ${chalk.gray(profile.gitEmail)}`);
    console.log(`    SSH Host: ${chalk.gray(profile.sshHost)}`);

    if (isActive) {
      console.log(chalk.green('    [ACTIVE]'));
    }

    console.log('');
  }

  if (activeProfile) {
    console.log(chalk.gray(`Currently active: ${chalk.green.bold(activeProfile.name)}\n`));
  } else {
    console.log(chalk.yellow('No active profile. Use "gh-switch use <profile>" to activate one.\n'));
  }
}
