import chalk from 'chalk';
import { getActiveProfile } from '../config/config-manager';
import { getGlobalGitConfig, isGitInstalled } from '../utils/git-operations';

export async function currentCommand(): Promise<void> {
  // Check if git is installed
  if (!(await isGitInstalled())) {
    console.log(chalk.red('❌ Git is not installed. Please install Git and try again.'));
    process.exit(1);
  }

  const activeProfile = await getActiveProfile();
  const gitConfig = await getGlobalGitConfig();

  console.log(chalk.blue.bold('\n📌 Current Configuration\n'));

  if (activeProfile) {
    console.log(chalk.cyan('Active Profile:'));
    console.log(`  Name: ${chalk.green.bold(activeProfile.name)}`);
    console.log(`  GitHub: ${chalk.bold(activeProfile.githubUsername)}`);
    console.log(`  Email: ${activeProfile.gitEmail}`);
    console.log(`  SSH Host: ${chalk.gray(activeProfile.sshHost)}`);
    console.log(`  SSH Key: ${chalk.gray(activeProfile.sshKeyPath)}`);
  } else {
    console.log(chalk.yellow('Active Profile: None'));
    console.log(chalk.gray('Use "gh-switch use <profile>" to activate a profile.'));
  }

  console.log(chalk.cyan('\nGlobal Git Config:'));
  console.log(`  user.name: ${chalk.bold(gitConfig.name || chalk.gray('(not set)'))}`);
  console.log(`  user.email: ${chalk.bold(gitConfig.email || chalk.gray('(not set)'))}`);

  // Check if git config matches active profile
  if (activeProfile && gitConfig.name && gitConfig.email) {
    const matches =
      gitConfig.name === activeProfile.gitName &&
      gitConfig.email === activeProfile.gitEmail;

    if (!matches) {
      console.log(
        chalk.yellow(
          '\n⚠️  Warning: Global git config does not match active profile.'
        )
      );
      console.log(
        chalk.gray(
          `Run "gh-switch use ${activeProfile.name}" to sync the configuration.`
        )
      );
    }
  }

  console.log('');
}
