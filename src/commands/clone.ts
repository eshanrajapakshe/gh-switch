import chalk from 'chalk';
import inquirer from 'inquirer';
import * as path from 'path';
import { getProfile, getAllProfiles, getActiveProfile } from '../config/config-manager';
import {
  cloneRepo,
  setLocalGitConfig,
  isGitInstalled,
  rewriteGitURL,
} from '../utils/git-operations';

export async function cloneCommand(
  repoUrl?: string,
  profileName?: string,
  destination?: string
): Promise<void> {
  // Check if git is installed
  if (!(await isGitInstalled())) {
    console.log(chalk.red('❌ Git is not installed. Please install Git and try again.'));
    process.exit(1);
  }

  let targetRepoUrl = repoUrl;
  let targetProfileName = profileName;

  // If no repo URL provided, prompt for it
  if (!targetRepoUrl) {
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'repoUrl',
        message: 'Repository URL to clone:',
        validate: (input) => {
          if (!input.trim()) {
            return 'Repository URL is required';
          }
          if (
            !input.includes('github.com') &&
            !input.includes('git@') &&
            !input.includes('.git')
          ) {
            return 'Please provide a valid GitHub repository URL';
          }
          return true;
        },
      },
    ]);
    targetRepoUrl = answer.repoUrl;
  }

  // If no profile specified, prompt user or use active profile
  if (!targetProfileName) {
    const profiles = await getAllProfiles();

    if (profiles.length === 0) {
      console.log(chalk.yellow('\n⚠️  No profiles configured yet.'));
      console.log(chalk.cyan('Run "gh-switch init" to add your first profile.\n'));
      return;
    }

    // Check if there's an active profile
    const activeProfile = await getActiveProfile();

    if (profiles.length === 1 || (activeProfile && profiles.length > 1)) {
      // If only one profile or there's an active profile, ask to use it
      const defaultProfile = activeProfile || profiles[0];

      const answer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'useDefault',
          message: `Clone with profile "${defaultProfile.name}" (${defaultProfile.githubUsername})?`,
          default: true,
        },
      ]);

      if (answer.useDefault) {
        targetProfileName = defaultProfile.name;
      } else {
        const selectAnswer = await inquirer.prompt([
          {
            type: 'list',
            name: 'profileName',
            message: 'Select a profile to use:',
            choices: profiles.map((p) => ({
              name: `${p.name} (${p.githubUsername} - ${p.gitEmail})`,
              value: p.name,
            })),
          },
        ]);
        targetProfileName = selectAnswer.profileName;
      }
    } else {
      // Multiple profiles and no active one, prompt to select
      const answer = await inquirer.prompt([
        {
          type: 'list',
          name: 'profileName',
          message: 'Select a profile to use:',
          choices: profiles.map((p) => ({
            name: `${p.name} (${p.githubUsername} - ${p.gitEmail})`,
            value: p.name,
          })),
        },
      ]);
      targetProfileName = answer.profileName;
    }
  }

  const profile = await getProfile(targetProfileName!);

  if (!profile) {
    console.log(chalk.red(`\n❌ Profile "${targetProfileName!}" not found.`));
    console.log(chalk.cyan('Run "gh-switch list" to see available profiles.\n'));
    process.exit(1);
  }

  try {
    console.log(chalk.blue('\n📥 Cloning repository...\n'));
    console.log(`  Repository: ${chalk.bold(targetRepoUrl!)}`);
    console.log(`  Profile: ${chalk.bold(profile.name)} (${profile.githubUsername})`);
    console.log(`  SSH Host: ${chalk.gray(profile.sshHost)}\n`);

    // Show the rewritten URL
    const rewrittenUrl = rewriteGitURL(targetRepoUrl!, profile.sshHost);
    console.log(chalk.gray(`  Using SSH URL: ${rewrittenUrl}\n`));

    // Clone the repository
    const repoDir = await cloneRepo(targetRepoUrl!, profile.sshHost, destination);

    // Set local git config for the repository
    const repoPath = path.resolve(repoDir);
    await setLocalGitConfig(repoPath, profile.gitName, profile.gitEmail);

    console.log(chalk.green('\n✅ Repository cloned successfully!\n'));
    console.log(chalk.cyan('Local git config set:'));
    console.log(`  user.name: ${chalk.bold(profile.gitName)}`);
    console.log(`  user.email: ${chalk.bold(profile.gitEmail)}`);
    console.log(`\nDirectory: ${chalk.bold(repoPath)}\n`);
  } catch (error: any) {
    console.log(chalk.red(`\n❌ Failed to clone repository: ${error.message}\n`));
    console.log(
      chalk.yellow('Make sure your SSH key is added to your GitHub account.')
    );
    console.log(
      chalk.cyan(`Run "gh-switch verify ${profile.name}" to test the connection.\n`)
    );
    process.exit(1);
  }
}
