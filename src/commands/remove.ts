import chalk from 'chalk';
import inquirer from 'inquirer';
import { getProfile, removeProfile, getAllProfiles } from '../config/config-manager';
import { removeSSHConfigEntry } from '../utils/ssh-config';

export async function removeCommand(profileName?: string): Promise<void> {
  let targetProfileName = profileName;

  // If no profile name provided, prompt user to select
  if (!targetProfileName) {
    const profiles = await getAllProfiles();

    if (profiles.length === 0) {
      console.log(chalk.yellow('\n⚠️  No profiles configured yet.'));
      console.log(chalk.cyan('Nothing to remove.\n'));
      return;
    }

    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'profileName',
        message: 'Select a profile to remove:',
        choices: profiles.map((p) => ({
          name: `${p.name} (${p.githubUsername} - ${p.gitEmail})`,
          value: p.name,
        })),
      },
    ]);

    targetProfileName = answer.profileName;
  }

  const profile = await getProfile(targetProfileName!);

  if (!profile) {
    console.log(chalk.red(`\n❌ Profile "${targetProfileName!}" not found.`));
    console.log(chalk.cyan('Run "gh-switch list" to see available profiles.\n'));
    process.exit(1);
  }

  // Confirm deletion
  console.log(chalk.yellow('\n⚠️  You are about to remove the following profile:\n'));
  console.log(`  Name: ${chalk.bold(profile.name)}`);
  console.log(`  GitHub: ${chalk.bold(profile.githubUsername)}`);
  console.log(`  Email: ${profile.gitEmail}`);
  console.log(`  SSH Host: ${profile.sshHost}\n`);

  const confirmation = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: 'Are you sure you want to remove this profile?',
      default: false,
    },
  ]);

  if (!confirmation.confirmed) {
    console.log(chalk.gray('\nCancelled. No changes made.\n'));
    return;
  }

  try {
    // Remove SSH config entry
    await removeSSHConfigEntry(profile.sshHost);

    // Remove profile from config
    await removeProfile(profile.name);

    console.log(chalk.green('\n✅ Profile removed successfully!\n'));
    console.log(chalk.gray('SSH config entry has been removed.'));
    console.log(chalk.gray('The SSH key file itself has not been deleted.\n'));
  } catch (error: any) {
    console.log(chalk.red(`\n❌ Failed to remove profile: ${error.message}\n`));
    process.exit(1);
  }
}
