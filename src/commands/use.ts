import chalk from 'chalk';
import { getProfile, setActiveProfile, getAllProfiles } from '../config/config-manager';
import { setGlobalGitName, setGlobalGitEmail, isGitInstalled } from '../utils/git-operations';
import inquirer from 'inquirer';

export async function useCommand(profileName?: string): Promise<void> {
  // Check if git is installed
  if (!(await isGitInstalled())) {
    console.log(chalk.red('❌ Git is not installed. Please install Git and try again.'));
    process.exit(1);
  }

  let targetProfileName = profileName;

  // If no profile name provided, prompt user to select
  if (!targetProfileName) {
    const profiles = await getAllProfiles();

    if (profiles.length === 0) {
      console.log(chalk.yellow('\n⚠️  No profiles configured yet.'));
      console.log(chalk.cyan('Run "gh-switch init" to add your first profile.\n'));
      return;
    }

    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'profileName',
        message: 'Select a profile to switch to:',
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

  try {
    // Set global git config
    await setGlobalGitName(profile.gitName);
    await setGlobalGitEmail(profile.gitEmail);

    // Set as active profile in config
    await setActiveProfile(profile.name);

    console.log(chalk.green('\n✅ Switched to profile: ') + chalk.bold(profile.name));
    console.log(chalk.cyan('\nGlobal git config updated:'));
    console.log(`  user.name: ${chalk.bold(profile.gitName)}`);
    console.log(`  user.email: ${chalk.bold(profile.gitEmail)}`);
    console.log(`  GitHub: ${chalk.bold(profile.githubUsername)}`);
    console.log(`  SSH Host: ${chalk.gray(profile.sshHost)}\n`);

    console.log(chalk.gray('💡 Tip: Use "gh-switch clone <repo-url>" to clone repos with this profile.\n'));
  } catch (error: any) {
    console.log(chalk.red(`\n❌ Failed to switch profile: ${error.message}\n`));
    process.exit(1);
  }
}
