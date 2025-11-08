import inquirer from 'inquirer';
import chalk from 'chalk';
import { Profile } from '../types';
import { addProfile, getAllProfiles, isSSHKeyInUse } from '../config/config-manager';
import { expandTilde, fileExists, isValidEmail } from '../utils/file-operations';
import { isGitInstalled } from '../utils/git-operations';
import {
  generateSSHHost,
  addSSHConfigEntry,
  createSSHConfigEntry,
} from '../utils/ssh-config';
import {
  detectGitConfig,
  detectSSHKeys,
  getDefaultSSHKey,
} from '../utils/detect-config';
import {
  generateSSHKey,
  generateSSHKeyName,
} from '../utils/ssh-keygen';

export async function initCommand(): Promise<void> {
  console.log(chalk.blue.bold('\n🚀 Welcome to gh-switch!\n'));
  console.log('This wizard will help you set up your first GitHub account profile.\n');

  // Check if git is installed
  if (!(await isGitInstalled())) {
    console.log(chalk.red('❌ Git is not installed. Please install Git and try again.'));
    process.exit(1);
  }

  // Check if already initialized
  const profiles = await getAllProfiles();
  if (profiles.length > 0) {
    console.log(chalk.yellow('⚠️  gh-switch is already initialized.'));
    console.log(`You have ${profiles.length} profile(s) configured.`);
    console.log(chalk.cyan('\nUse "gh-switch add" to add more profiles.'));
    console.log(chalk.cyan('Use "gh-switch list" to see all profiles.\n'));
    return;
  }

  // Detect existing Git configuration
  const existingGitConfig = await detectGitConfig();
  const sshKeys = await detectSSHKeys();
  const defaultSSHKey = await getDefaultSSHKey();

  if (existingGitConfig) {
    console.log(chalk.cyan('📋 Detected existing Git configuration:'));
    console.log(`  Name: ${chalk.bold(existingGitConfig.name)}`);
    console.log(`  Email: ${chalk.bold(existingGitConfig.email)}\n`);
  }

  if (sshKeys.length > 0) {
    console.log(chalk.cyan(`🔑 Found ${sshKeys.length} SSH key(s) in ~/.ssh/\n`));
  }

  console.log(chalk.gray('Let\'s add your first GitHub account...\n'));

  const prompts: any[] = [
    {
      type: 'input',
      name: 'profileName',
      message: 'Profile name (e.g., personal, work):',
      default: 'personal',
      validate: (input: string) => {
        if (!input.trim()) {
          return 'Profile name is required';
        }
        if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
          return 'Profile name can only contain letters, numbers, hyphens, and underscores';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'gitName',
      message: 'Git user name:',
      default: existingGitConfig?.name,
      validate: (input: string) => (input.trim() ? true : 'Git user name is required'),
    },
    {
      type: 'input',
      name: 'gitEmail',
      message: 'Git user email:',
      default: existingGitConfig?.email,
      validate: (input: string) => {
        if (!input.trim()) {
          return 'Git user email is required';
        }
        if (!isValidEmail(input)) {
          return 'Please enter a valid email address';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'githubUsername',
      message: 'GitHub username:',
      validate: (input: string) => (input.trim() ? true : 'GitHub username is required'),
    },
  ];

  // SSH Key selection
  if (sshKeys.length > 0) {
    prompts.push({
      type: 'list',
      name: 'sshKeyPath',
      message: 'Select SSH private key:',
      choices: [
        ...sshKeys.map((key) => ({
          name: `${key.name}${key.hasPublicKey ? ' ✓ (has .pub)' : ''}`,
          value: key.path,
        })),
        {
          name: 'Enter custom path...',
          value: '__custom__',
        },
      ],
      default: defaultSSHKey,
    });
  } else {
    prompts.push({
      type: 'input',
      name: 'sshKeyPath',
      message: 'Path to SSH private key:',
      default: '~/.ssh/id_rsa',
      validate: async (input: string) => {
        const expandedPath = expandTilde(input.trim());
        if (await fileExists(expandedPath)) {
          return true;
        }
        return `SSH key not found at ${expandedPath}`;
      },
    });
  }

  const answers = await inquirer.prompt(prompts);

  // If user selected custom path, prompt for it
  if (answers.sshKeyPath === '__custom__') {
    const customPathAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'customPath',
        message: 'Enter custom SSH key path:',
        default: '~/.ssh/id_rsa',
        validate: async (input: string) => {
          const expandedPath = expandTilde(input.trim());
          if (await fileExists(expandedPath)) {
            return true;
          }
          return `SSH key not found at ${expandedPath}`;
        },
      },
    ]);
    answers.sshKeyPath = customPathAnswer.customPath;
  }

  let expandedKeyPath = expandTilde(answers.sshKeyPath);

  // Check if SSH key is already in use by another profile
  const keyInUse = await isSSHKeyInUse(expandedKeyPath);

  if (keyInUse.inUse) {
    console.log(
      chalk.yellow(
        `\n⚠️  This SSH key is already being used by the "${keyInUse.profileName}" profile.`
      )
    );
    console.log(
      chalk.cyan(
        'GitHub does not allow the same SSH key to be registered on multiple accounts.'
      )
    );

    const generateNewKey = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'generate',
        message: 'Would you like to generate a new SSH key for this profile?',
        default: true,
      },
    ]);

    if (generateNewKey.generate) {
      console.log(chalk.blue('\n🔑 Generating new SSH key...\n'));

      try {
        const keyName = generateSSHKeyName(answers.profileName);
        const result = await generateSSHKey(answers.gitEmail, keyName);

        expandedKeyPath = result.privateKeyPath;

        console.log(chalk.green('✅ SSH key generated successfully!\n'));
        console.log(chalk.cyan('SSH Key Details:'));
        console.log(`  Private key: ${chalk.bold(result.privateKeyPath)}`);
        console.log(`  Public key: ${chalk.bold(result.publicKeyPath)}\n`);

        console.log(
          chalk.yellow(
            '📋 Copy the public key below and add it to your GitHub account:'
          )
        );
        console.log(chalk.cyan('   GitHub → Settings → SSH and GPG keys → New SSH key\n'));
        console.log(chalk.gray('─'.repeat(80)));
        console.log(chalk.white(result.publicKeyContent));
        console.log(chalk.gray('─'.repeat(80)));

        const continuePrompt = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'continue',
            message: '\nHave you added the SSH key to your GitHub account?',
            default: false,
          },
        ]);

        if (!continuePrompt.continue) {
          console.log(
            chalk.yellow(
              '\n⚠️  Please add the SSH key to GitHub before continuing.'
            )
          );
          console.log(
            chalk.gray(
              `You can find the public key at: ${result.publicKeyPath}\n`
            )
          );
          process.exit(0);
        }
      } catch (error: any) {
        console.log(
          chalk.red(`\n❌ Failed to generate SSH key: ${error.message}\n`)
        );
        process.exit(1);
      }
    } else {
      console.log(
        chalk.yellow(
          '\n⚠️  Cannot proceed with the same SSH key. Please use a different key or generate a new one.\n'
        )
      );
      process.exit(0);
    }
  }

  const sshHost = generateSSHHost(answers.profileName);

  const profile: Profile = {
    name: answers.profileName,
    gitName: answers.gitName,
    gitEmail: answers.gitEmail,
    githubUsername: answers.githubUsername,
    sshKeyPath: expandedKeyPath,
    sshHost,
  };

  try {
    // Add profile to config
    await addProfile(profile);

    // Add SSH config entry
    const sshEntry = createSSHConfigEntry(sshHost, expandedKeyPath);
    await addSSHConfigEntry(sshEntry);

    console.log(chalk.green('\n✅ Profile added successfully!\n'));
    console.log(chalk.cyan('Profile details:'));
    console.log(`  Name: ${chalk.bold(profile.name)}`);
    console.log(`  GitHub: ${chalk.bold(profile.githubUsername)}`);
    console.log(`  Email: ${profile.gitEmail}`);
    console.log(`  SSH Host: ${profile.sshHost}`);

    console.log(chalk.cyan('\n📝 Next steps:'));
    console.log(`  1. Test the connection: ${chalk.bold(`gh-switch verify ${profile.name}`)}`);
    console.log(`  2. Switch to this profile: ${chalk.bold(`gh-switch use ${profile.name}`)}`);
    console.log(`  3. Clone a repo: ${chalk.bold(`gh-switch clone <repo-url> ${profile.name}`)}`);
    console.log(`  4. Add more profiles: ${chalk.bold('gh-switch add')}\n`);
  } catch (error: any) {
    console.log(chalk.red(`\n❌ Failed to add profile: ${error.message}\n`));
    process.exit(1);
  }
}
