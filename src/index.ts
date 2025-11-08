#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init';
import { addCommand } from './commands/add';
import { listCommand } from './commands/list';
import { useCommand } from './commands/use';
import { currentCommand } from './commands/current';
import { cloneCommand } from './commands/clone';
import { verifyCommand } from './commands/verify';
import { removeCommand } from './commands/remove';
import { configCommand } from './commands/config';

const program = new Command();

program
  .name('gh-switch')
  .description('Easily switch between multiple GitHub accounts on the same machine')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize gh-switch and add your first account')
  .action(async () => {
    try {
      await initCommand();
    } catch (error: any) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('add')
  .description('Add a new GitHub account profile')
  .action(async () => {
    try {
      await addCommand();
    } catch (error: any) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('list')
  .alias('ls')
  .description('List all configured GitHub account profiles')
  .action(async () => {
    try {
      await listCommand();
    } catch (error: any) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('use [profile]')
  .description('Switch to a specific GitHub account profile')
  .action(async (profile?: string) => {
    try {
      await useCommand(profile);
    } catch (error: any) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('current')
  .description('Show currently active GitHub account')
  .action(async () => {
    try {
      await currentCommand();
    } catch (error: any) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('clone <repo-url> [profile] [destination]')
  .description('Clone a repository using a specific GitHub account')
  .action(async (repoUrl: string, profile?: string, destination?: string) => {
    try {
      await cloneCommand(repoUrl, profile, destination);
    } catch (error: any) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('verify [profile]')
  .description('Test SSH connection to GitHub for one or all profiles')
  .action(async (profile?: string) => {
    try {
      await verifyCommand(profile);
    } catch (error: any) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('remove [profile]')
  .alias('rm')
  .description('Remove a GitHub account profile')
  .action(async (profile?: string) => {
    try {
      await removeCommand(profile);
    } catch (error: any) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('config')
  .description('Show or edit configuration')
  .option('-e, --edit', 'Open configuration file in editor')
  .action(async (options) => {
    try {
      await configCommand(options);
    } catch (error: any) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse(process.argv);
