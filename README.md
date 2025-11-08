# gh-switch

A TypeScript-based CLI tool that helps you easily switch between multiple GitHub accounts on the same machine.

## Features

### 🎯 Smart Account Management
- **Auto-Detection**: Detects existing Git configuration and SSH keys automatically
- **Multi-Account Support**: Manage unlimited GitHub accounts (personal, work, client projects, etc.)
- **Quick Switching**: Switch between accounts with a single command
- **Active Profile Tracking**: Always know which account is currently active

### 🔑 Intelligent SSH Key Management
- **Duplicate Detection**: Automatically detects if an SSH key is already in use
- **Auto-Generation**: Generates new SSH keys when duplicates are detected
- **Key Display**: Shows generated public keys for easy copying to GitHub
- **Smart Selection**: Presents available SSH keys as a list with visual indicators
- **Secure Keys**: Uses Ed25519 algorithm (more secure than RSA)

### 🚀 Seamless Git Operations
- **Intelligent Cloning**: Clone repositories with the correct account credentials automatically
- **Local Config**: Sets repository-specific git config for consistent commits
- **SSH Config Management**: Automatically manages `~/.ssh/config` with host aliases
- **URL Rewriting**: Transparently rewrites Git URLs to use correct SSH keys

### ✨ Developer Experience
- **Interactive Prompts**: User-friendly prompts with sensible defaults
- **Visual Feedback**: Colored output with clear success/error messages
- **Connection Verification**: Test SSH connections before using accounts
- **Configuration Editing**: Easy access to view and edit configuration
- **Cross-Platform**: Works on Windows, macOS, and Linux

## Prerequisites

- Node.js (v14 or higher)
- Git installed and available in PATH
- **No SSH keys required!** The tool can generate them for you

## Installation

### Global Installation (Recommended)

```bash
npm install -g @eshanrajapakshe/gh-switch
```

### Local Development

```bash
# Clone the repository
git clone <repo-url>
cd gh-switch

# Install dependencies
npm install

# Build the project
npm run build

# Link globally for testing
npm link
```

## Quick Start

### 1. Initialize gh-switch

Run the initialization wizard to add your first GitHub account:

```bash
gh-switch init
```

The wizard will:
- **Auto-detect** your current Git configuration (name and email)
- **Scan** for SSH keys in your `~/.ssh/` directory
- **Present** SSH keys as easy-to-select options
- Guide you through providing a profile name and GitHub username
- Set up everything automatically with smart defaults

### 2. Add Your Second Account

```bash
gh-switch add
```

**Smart SSH Key Handling:**
- If you select an SSH key already used by another profile, the tool will detect it
- It will offer to **automatically generate a new SSH key** for you
- The public key will be displayed on screen for easy copying
- Just add it to your GitHub account and you're done!

**Example flow:**
```
⚠️  This SSH key is already being used by the "work" profile.
GitHub does not allow the same SSH key to be registered on multiple accounts.

? Would you like to generate a new SSH key for this profile? Yes

🔑 Generating new SSH key...

✅ SSH key generated successfully!

📋 Copy the public key below and add it to your GitHub account:
   GitHub → Settings → SSH and GPG keys → New SSH key

────────────────────────────────────────────────
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA... your-email@example.com
────────────────────────────────────────────────
```

### 3. Verify Connections

Test that your SSH connections to GitHub work:

```bash
gh-switch verify
```

### 4. Switch Between Accounts

Activate a profile to set it as your global git configuration:

```bash
gh-switch use personal  # Switch to personal
gh-switch use work      # Switch to work
```

### 5. Clone Repositories

Clone a repository using a specific profile:

```bash
gh-switch clone https://github.com/username/repo.git personal
```

The repository will be automatically configured to use the correct account for all operations!

## Commands

### `gh-switch init`

Initialize gh-switch and add your first account profile. This command:
- **Auto-detects** existing Git configuration and uses it as defaults
- **Scans** `~/.ssh/` directory for SSH keys and presents them as options
- Creates the configuration directory (`~/.gh-switch/`)
- Guides you through adding your first profile with smart defaults
- Configures SSH settings automatically

**Features:**
- Git name and email are pre-filled from your current configuration
- SSH keys are presented as a list to choose from
- Keys with `.pub` files are marked for easy identification (✓)
- Option to enter a custom SSH key path if needed

### `gh-switch add`

Add a new GitHub account profile interactively. Same smart features as `init`, plus:
- **Duplicate SSH Key Detection**: Warns if you select a key already in use
- **Automatic Key Generation**: Offers to generate a new SSH key
- **Public Key Display**: Shows the generated key for easy copying to GitHub
- **Guided Setup**: Waits for confirmation before proceeding

**Example:**
```bash
gh-switch add
```

**When duplicate SSH key is detected:**
```
⚠️  This SSH key is already being used by the "work" profile.

? Would you like to generate a new SSH key for this profile? (Y/n)

✅ SSH key generated successfully!
Private key: ~/.ssh/id_ed25519_personal
Public key: ~/.ssh/id_ed25519_personal.pub

📋 Copy the public key below and add it to your GitHub account:
────────────────────────────────────────────────
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA...
────────────────────────────────────────────────

? Have you added the SSH key to your GitHub account? (y/N)
```

### `gh-switch list` (alias: `ls`)

Display all configured profiles and highlight the currently active one.

**Example:**
```bash
gh-switch list
```

**Output:**
```
📋 GitHub Account Profiles (2)

● personal
    GitHub: johndoe
    Email: john@personal.com
    SSH Host: github.com-personal
    [ACTIVE]

  work
    GitHub: jdoe-company
    Email: john@company.com
    SSH Host: github.com-work
```

### `gh-switch use [profile]`

Switch to a specific profile. This updates your global git configuration.

**Example:**
```bash
gh-switch use work
```

If you don't specify a profile, you'll be prompted to select one.

### `gh-switch current`

Show the currently active profile and git configuration.

**Example:**
```bash
gh-switch current
```

**Output:**
```
📌 Current Configuration

Active Profile:
  Name: personal
  GitHub: johndoe
  Email: john@personal.com
  SSH Host: github.com-personal
  SSH Key: /Users/john/.ssh/id_rsa_personal

Global Git Config:
  user.name: John Doe
  user.email: john@personal.com
```

### `gh-switch clone <repo-url> [profile] [destination]`

Clone a repository using a specific profile. The repository will be configured to use the profile's credentials locally.

**Examples:**
```bash
# Clone with a specific profile
gh-switch clone https://github.com/user/repo.git work

# Clone to a specific directory
gh-switch clone https://github.com/user/repo.git work my-project

# Interactive selection if profile not specified
gh-switch clone https://github.com/user/repo.git
```

The clone command:
- Rewrites the repository URL to use the correct SSH host alias
- Clones the repository
- Sets local git config (user.name and user.email) for the repository

### `gh-switch verify [profile]`

Test SSH connection to GitHub for one or all profiles.

**Examples:**
```bash
# Verify all profiles
gh-switch verify

# Verify specific profile
gh-switch verify personal
```

**Output:**
```
🔍 Verifying SSH connections to GitHub...

Testing personal (johndoe)...
  ✅ Success: Hi johndoe! You've successfully authenticated...

Testing work (jdoe-company)...
  ✅ Success: Hi jdoe-company! You've successfully authenticated...

Summary:
  ✅ Successful: 2
  ❌ Failed: 0
```

### `gh-switch remove [profile]` (alias: `rm`)

Remove a profile from gh-switch. You'll be asked to confirm before deletion.

**Examples:**
```bash
# Remove a specific profile
gh-switch remove old-account

# Interactive selection
gh-switch remove
```

### `gh-switch config [--edit]`

Show or edit the configuration file.

**Examples:**
```bash
# Display current configuration
gh-switch config

# Open configuration file in default editor
gh-switch config --edit
```

## Configuration

gh-switch stores its configuration in `~/.gh-switch/config.json`.

### Configuration Structure

```json
{
  "profiles": [
    {
      "name": "personal",
      "gitName": "John Doe",
      "gitEmail": "john@personal.com",
      "githubUsername": "johndoe",
      "sshKeyPath": "/Users/john/.ssh/id_rsa_personal",
      "sshHost": "github.com-personal"
    }
  ],
  "activeProfile": "personal",
  "version": "1.0.0"
}
```

### SSH Configuration

gh-switch automatically manages entries in your `~/.ssh/config` file. Managed entries are marked with comments:

```
# --- gh-switch managed entries START ---
Host github.com-personal
  HostName github.com
  User git
  IdentityFile /Users/john/.ssh/id_rsa_personal
  IdentitiesOnly yes

Host github.com-work
  HostName github.com
  User git
  IdentityFile /Users/john/.ssh/id_rsa_work
  IdentitiesOnly yes
# --- gh-switch managed entries END ---
```

## Smart Auto-Detection

gh-switch makes setup easier by automatically detecting your existing configuration:

### Git Configuration Detection

When you run `gh-switch init` or `gh-switch add`, the tool:
- Reads your current global Git configuration (`git config --global user.name` and `user.email`)
- Pre-fills these values as defaults in the interactive prompts
- Saves you from typing information you've already configured
- Allows you to override with different values if needed

**Example:**
```bash
$ gh-switch add

📋 Current Git configuration:
  Name: John Doe
  Email: john@personal.com
  (You can use different values for this profile)

? Git user name: (John Doe) ← Press Enter to use default or type a new value
? Git user email: (john@personal.com) john@company.com ← Change for work account
```

### SSH Key Detection

The tool automatically scans your `~/.ssh/` directory for SSH keys:
- Detects common SSH key types (RSA, Ed25519, ECDSA, DSA)
- Shows all available keys as a selectable list
- Highlights keys that have corresponding `.pub` (public key) files
- Prioritizes Ed25519 keys (more secure) over RSA keys
- Provides an option to enter a custom path if needed

**Detected Key Patterns:**
- `id_rsa`, `id_rsa_*` (RSA keys)
- `id_ed25519`, `id_ed25519_*` (Ed25519 keys - recommended)
- `id_ecdsa`, `id_ecdsa_*` (ECDSA keys)
- `id_dsa`, `id_dsa_*` (DSA keys)

**Example:**
```bash
🔑 Found 3 SSH key(s) in ~/.ssh/

? Select SSH private key: (Use arrow keys)
❯ id_ed25519_personal ✓ (has .pub)
  id_rsa_work ✓ (has .pub)
  id_rsa ✓ (has .pub)
  Enter custom path... ← Select this to enter a manual path
```

### Benefits

This smart detection:
- **Speeds up setup** - Less typing, fewer errors
- **Prevents mistakes** - See what keys you actually have
- **Improves UX** - Clear visual indicators (✓ for keys with .pub files)
- **Maintains flexibility** - Can always override or enter custom values

## How It Works

### Account Switching

When you run `gh-switch use <profile>`, the tool:
1. Updates your global git config (`user.name` and `user.email`)
2. Sets the profile as active in the configuration

### Repository Cloning

When you run `gh-switch clone <repo-url> <profile>`, the tool:
1. Rewrites the repository URL to use the profile's SSH host alias
2. Clones the repository using the rewritten URL
3. Sets local git config in the cloned repository to use the profile's credentials

This ensures that commits in that repository use the correct account.

### SSH Host Aliases

Each profile gets a unique SSH host alias (e.g., `github.com-personal`, `github.com-work`). This allows you to:
- Use different SSH keys for different accounts
- Clone repositories with specific accounts
- Avoid SSH key conflicts

## Common Workflows

### Setting Up Multiple Accounts

```bash
# Initialize with your personal account
gh-switch init

# Add your work account
gh-switch add

# Verify both accounts
gh-switch verify
```

### Working on Personal Projects

```bash
# Switch to personal account
gh-switch use personal

# Clone a personal repo
gh-switch clone https://github.com/johndoe/my-project.git

# Work on the project...
cd my-project
git add .
git commit -m "Update feature"
git push
```

### Working on Work Projects

```bash
# Switch to work account
gh-switch use work

# Clone a work repo
gh-switch clone https://github.com/company/work-project.git

# Work on the project...
cd work-project
git add .
git commit -m "Implement feature"
git push
```

### Checking Current Status

```bash
# See which account is active
gh-switch current

# List all accounts
gh-switch list
```

## Troubleshooting

### SSH Connection Failed

If `gh-switch verify` fails:

1. **Check if your SSH key is added to GitHub:**
   - Go to GitHub Settings → SSH and GPG keys
   - Add your public key if not present

2. **Verify SSH key path:**
   ```bash
   gh-switch config
   ```
   Make sure the `sshKeyPath` is correct

3. **Check SSH key permissions:**
   ```bash
   ls -l ~/.ssh/id_rsa_*
   ```
   Private keys should have permissions `600` or `400`

4. **Test SSH manually:**
   ```bash
   ssh -T git@github.com-personal
   ```

### Git Commands Use Wrong Account

If your commits show the wrong author:

1. **Check active profile:**
   ```bash
   gh-switch current
   ```

2. **Switch to correct profile:**
   ```bash
   gh-switch use <correct-profile>
   ```

3. **For existing repositories, set local config:**
   ```bash
   cd your-repo
   git config user.name "Your Name"
   git config user.email "your@email.com"
   ```

### Clone Failed

If `gh-switch clone` fails:

1. **Verify SSH connection:**
   ```bash
   gh-switch verify <profile>
   ```

2. **Check repository URL format:**
   - Supported: `https://github.com/user/repo.git`
   - Supported: `git@github.com:user/repo.git`

3. **Ensure profile exists:**
   ```bash
   gh-switch list
   ```

## SSH Key Generation

If you need to generate SSH keys for your accounts:

### Generate a new SSH key

```bash
# For personal account
ssh-keygen -t ed25519 -C "your-personal@email.com" -f ~/.ssh/id_ed25519_personal

# For work account
ssh-keygen -t ed25519 -C "your-work@email.com" -f ~/.ssh/id_ed25519_work
```

### Add the public key to GitHub

```bash
# Display your public key
cat ~/.ssh/id_ed25519_personal.pub

# Copy the output and add it to GitHub:
# GitHub → Settings → SSH and GPG keys → New SSH key
```

## Uninstallation

```bash
# Uninstall globally
npm uninstall -g gh-switch

# Optionally remove configuration
rm -rf ~/.gh-switch
```

Note: Your `~/.ssh/config` file will retain the gh-switch managed entries. You can remove them manually if needed.

## Development

### Project Structure

```
gh-switch/
├── src/
│   ├── commands/        # Command implementations
│   │   ├── add.ts
│   │   ├── clone.ts
│   │   ├── config.ts
│   │   ├── current.ts
│   │   ├── init.ts
│   │   ├── list.ts
│   │   ├── remove.ts
│   │   ├── use.ts
│   │   └── verify.ts
│   ├── config/          # Configuration management
│   │   └── config-manager.ts
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/           # Utility functions
│   │   ├── file-operations.ts
│   │   ├── git-operations.ts
│   │   └── ssh-config.ts
│   └── index.ts         # CLI entry point
├── package.json
├── tsconfig.json
└── README.md
```

### Building

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.
