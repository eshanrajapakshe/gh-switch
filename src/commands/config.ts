import chalk from 'chalk';
import { exec } from 'child_process';
import { promisify } from 'util';
import { getConfigFilePath, loadConfig } from '../config/config-manager';
import { fileExists } from '../utils/file-operations';

const execAsync = promisify(exec);

export async function configCommand(options: { edit?: boolean } = {}): Promise<void> {
  const configPath = getConfigFilePath();

  if (!(await fileExists(configPath))) {
    console.log(chalk.yellow('\n⚠️  Configuration file does not exist yet.'));
    console.log(chalk.cyan('Run "gh-switch init" to create it.\n'));
    return;
  }

  if (options.edit) {
    // Open in editor
    console.log(chalk.blue('\n📝 Opening configuration file in editor...\n'));

    try {
      // Determine the editor to use
      const editor = process.env.EDITOR || process.env.VISUAL || getDefaultEditor();

      await execAsync(`"${editor}" "${configPath}"`);
    } catch (error: any) {
      console.log(chalk.red(`\n❌ Failed to open editor: ${error.message}`));
      console.log(chalk.gray(`\nConfiguration file location: ${configPath}\n`));
    }
  } else {
    // Display configuration
    console.log(chalk.blue.bold('\n⚙️  Configuration\n'));

    const config = await loadConfig();

    console.log(chalk.cyan('Configuration File:'));
    console.log(`  ${chalk.gray(configPath)}\n`);

    console.log(chalk.cyan('Profiles:'));
    if (config.profiles.length === 0) {
      console.log(chalk.gray('  No profiles configured'));
    } else {
      for (const profile of config.profiles) {
        const isActive = config.activeProfile === profile.name;
        const marker = isActive ? chalk.green('● ') : '  ';
        console.log(`${marker}${chalk.bold(profile.name)}`);
        console.log(`    GitHub: ${profile.githubUsername}`);
        console.log(`    Email: ${profile.gitEmail}`);
        console.log(`    SSH Host: ${profile.sshHost}`);
        console.log(`    SSH Key: ${profile.sshKeyPath}`);
      }
    }

    console.log(chalk.cyan('\nActive Profile:'));
    console.log(`  ${config.activeProfile || chalk.gray('None')}\n`);

    console.log(chalk.gray('💡 Tip: Use "gh-switch config --edit" to edit the configuration file.\n'));
  }
}

function getDefaultEditor(): string {
  const platform = process.platform;

  if (platform === 'win32') {
    return 'notepad';
  } else if (platform === 'darwin') {
    return 'nano';
  } else {
    return 'nano';
  }
}
