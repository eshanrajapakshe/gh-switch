import chalk from 'chalk';
import { getProfile, getAllProfiles } from '../config/config-manager';
import { testSSHConnection } from '../utils/git-operations';
import { VerifyResult } from '../types';

export async function verifyCommand(profileName?: string): Promise<void> {
  const profiles = await getAllProfiles();

  if (profiles.length === 0) {
    console.log(chalk.yellow('\n⚠️  No profiles configured yet.'));
    console.log(chalk.cyan('Run "gh-switch init" to add your first profile.\n'));
    return;
  }

  let profilesToVerify = profiles;

  // If a specific profile is specified, verify only that one
  if (profileName) {
    const profile = await getProfile(profileName);

    if (!profile) {
      console.log(chalk.red(`\n❌ Profile "${profileName}" not found.`));
      console.log(chalk.cyan('Run "gh-switch list" to see available profiles.\n'));
      process.exit(1);
    }

    profilesToVerify = [profile];
  }

  console.log(chalk.blue.bold('\n🔍 Verifying SSH connections to GitHub...\n'));

  const results: VerifyResult[] = [];

  for (const profile of profilesToVerify) {
    console.log(
      `Testing ${chalk.bold(profile.name)} (${profile.githubUsername})...`
    );

    const result = await testSSHConnection(profile.sshHost);

    results.push({
      profileName: profile.name,
      success: result.success,
      message: result.message,
    });

    if (result.success) {
      console.log(chalk.green(`  ✅ Success: ${result.message}`));
    } else {
      console.log(chalk.red(`  ❌ Failed: ${result.message}`));
    }

    console.log('');
  }

  // Summary
  const successCount = results.filter((r) => r.success).length;
  const failureCount = results.length - successCount;

  console.log(chalk.blue.bold('Summary:'));
  console.log(`  ${chalk.green(`✅ Successful: ${successCount}`)}`);
  console.log(`  ${chalk.red(`❌ Failed: ${failureCount}`)}\n`);

  if (failureCount > 0) {
    console.log(chalk.yellow('💡 Troubleshooting tips:'));
    console.log('  1. Ensure your SSH key is added to your GitHub account');
    console.log('  2. Check that the SSH key path in your profile is correct');
    console.log('  3. Verify SSH key permissions (should be 600 or 400)');
    console.log('  4. Test manually: ssh -T git@<ssh-host>\n');

    process.exit(1);
  }
}
