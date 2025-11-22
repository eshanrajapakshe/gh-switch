# gh-switch

**Seamlessly manage multiple GitHub accounts on the same machine.**

A simple CLI tool that lets you seamlessly manage multiple GitHub accounts on the same machine. Whether you switch between personal, work, and freelance profiles—or maintain several SSH keys—gh-switch handles the setup, switching, and cloning automatically.

Stop manually switching SSH keys and git configs. `gh-switch` lets you work with personal, work, and client GitHub accounts effortlessly—each with its own identity and SSH key.

## Installation

```bash
npm install -g @eshan.rajapakshe/gh-switch
```

**Requirements:** Node.js (v14+) and Git. No SSH keys needed—the tool generates them for you!

---

## Usage

### Step 1: Set Up Your First Account

```bash
gh-switch init
```

The interactive wizard will:
- Auto-detect your current Git name and email
- Scan for existing SSH keys in `~/.ssh/`
- Let you choose an SSH key or generate a new one
- Set up your first profile automatically

**Example:**
```
? Profile name: personal
? Git user name: John Doe
? Git user email: john@personal.com
? GitHub username: johndoe
? Select SSH private key: id_ed25519_personal ✓
```

---

### Step 2: Add More Accounts (Work, Client, etc.)

```bash
gh-switch add
```

Follow the same prompts. If you select an SSH key that's already in use, the tool will:
- Detect the duplicate
- Offer to generate a new SSH key automatically
- Display the public key for you to copy to GitHub

**Example:**
```
⚠️  This SSH key is already being used by the "personal" profile.

? Would you like to generate a new SSH key? Yes

✅ SSH key generated: ~/.ssh/id_ed25519_work

📋 Copy this public key to GitHub → Settings → SSH and GPG keys:
────────────────────────────────────────────────
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA... work@company.com
────────────────────────────────────────────────

? Have you added the SSH key to your GitHub account? Yes
```

---

### Step 3: Switch Between Accounts

```bash
gh-switch use personal    # Switch to personal account
gh-switch use work        # Switch to work account
```

This updates your global git config. All new commits will use the selected account's name and email.

---

### Step 4: Clone Repositories with the Right Account

```bash
# Clone with your work account
gh-switch clone https://github.com/company/project.git work

# Clone with your personal account
gh-switch clone https://github.com/johndoe/my-app.git personal
```

**The cloned repository is automatically configured to use the specified account—no manual setup needed!**

From this point onwards, **all commits, pushes, and pulls in that repository will automatically use the correct account**. You don't need to switch profiles or configure anything—just work normally:

```bash
cd project
git add .
git commit -m "Add feature"  # ✅ Commits as work account
git push                      # ✅ Pushes with work SSH key
```

The repository "remembers" which account it belongs to!

---

### Step 5: Verify Everything Works

```bash
gh-switch verify
```

This tests SSH connections for all your accounts:

```
🔍 Verifying SSH connections to GitHub...

Testing personal (johndoe)...
  ✅ Success: Hi johndoe! You've successfully authenticated

Testing work (jdoe-company)...
  ✅ Success: Hi jdoe-company! You've successfully authenticated

Summary:
  ✅ Successful: 2
  ❌ Failed: 0
```

---

### Daily Workflow

**Check which account is active:**
```bash
gh-switch current
```

**List all your accounts:**
```bash
gh-switch list
```

**Switch accounts:**
```bash
gh-switch use work
cd work-project
git commit -m "Add feature"  # Commits as work account
git push
```

That's it! You're now managing multiple GitHub accounts effortlessly.

---

## Command Reference

### `gh-switch init`
Set up your first GitHub account profile.

```bash
gh-switch init
```

### `gh-switch add`
Add another GitHub account (work, client, etc.).

```bash
gh-switch add
```

### `gh-switch use <profile>`
Switch to a different account.

```bash
gh-switch use personal
gh-switch use work
```

### `gh-switch clone <repo-url> <profile> [destination]`
Clone a repository with a specific account.

```bash
gh-switch clone https://github.com/user/repo.git work
gh-switch clone https://github.com/user/repo.git personal my-folder
```

### `gh-switch list` (alias: `ls`)
Show all configured accounts.

```bash
gh-switch list
```

Output:
```
📋 GitHub Account Profiles (2)

● personal
    GitHub: johndoe
    Email: john@personal.com
    [ACTIVE]

  work
    GitHub: jdoe-company
    Email: john@company.com
```

### `gh-switch current`
Show the currently active account.

```bash
gh-switch current
```

### `gh-switch verify [profile]`
Test SSH connections to GitHub.

```bash
gh-switch verify           # Test all accounts
gh-switch verify personal  # Test specific account
```

### `gh-switch remove <profile>` (alias: `rm`)
Remove an account profile.

```bash
gh-switch remove old-account
```

### `gh-switch config [--edit]`
View or edit the configuration file.

```bash
gh-switch config        # Display config
gh-switch config --edit # Open in editor
```

---

## How It Works

### The Problem
GitHub doesn't allow the same SSH key on multiple accounts. If you have a personal and work account, you need different SSH keys and git configs for each.

### The Solution
`gh-switch` uses **SSH host aliases** to route different repositories through different SSH keys:

1. **Each account gets a unique SSH host** (e.g., `github.com-personal`, `github.com-work`)
2. **Your `~/.ssh/config` is automatically managed** with entries like:
   ```
   Host github.com-personal
     HostName github.com
     IdentityFile ~/.ssh/id_ed25519_personal

   Host github.com-work
     HostName github.com
     IdentityFile ~/.ssh/id_ed25519_work
   ```
3. **When you clone with a profile**, the URL is rewritten to use the right host
4. **Local git config is set** so commits use the correct name and email

### What Happens When You Run Commands

**`gh-switch use personal`**
- Updates global git config: `user.name` and `user.email`
- Sets `personal` as the active profile

**`gh-switch clone <repo-url> work`**
- Rewrites URL: `github.com` → `github.com-work`
- Clones using the work account's SSH key
- Sets local git config in the repo to use work credentials

**Result:** Each repository automatically uses the correct account—no manual switching needed!

---

## Features

### 🎯 Smart Account Management
- **Auto-Detection**: Detects existing Git config and SSH keys
- **Unlimited Accounts**: Manage personal, work, client accounts, etc.
- **Quick Switching**: One command to switch accounts
- **Active Profile Tracking**: Always know which account is active

### 🔑 Intelligent SSH Key Management
- **Duplicate Detection**: Warns if an SSH key is already in use
- **Auto-Generation**: Generates new Ed25519 keys when needed
- **Key Display**: Shows public keys for easy copying to GitHub
- **Smart Selection**: Lists available SSH keys with visual indicators

### 🚀 Seamless Git Operations
- **Intelligent Cloning**: Clone repos with the right account automatically
- **Local Config**: Sets repo-specific git config for consistent commits
- **SSH Config Management**: Automatically manages `~/.ssh/config`
- **URL Rewriting**: Transparently rewrites URLs to use correct SSH keys

### ✨ Developer Experience
- **Interactive Prompts**: User-friendly with sensible defaults
- **Visual Feedback**: Colored output with clear messages
- **Connection Verification**: Test SSH connections before using
- **Cross-Platform**: Works on Windows, macOS, and Linux

---

## Troubleshooting

### ❌ SSH Connection Failed

**Run:**
```bash
gh-switch verify
```

**If it fails:**

1. **Is your SSH key added to GitHub?**
   - Go to GitHub → Settings → SSH and GPG keys
   - Add your public key (displayed during `gh-switch add`)

2. **Check SSH key permissions:**
   ```bash
   ls -l ~/.ssh/id_ed25519_*
   ```
   Private keys should be `600` or `400`

3. **Test manually:**
   ```bash
   ssh -T git@github.com-personal
   ```

### ❌ Commits Show Wrong Author

**Check which account is active:**
```bash
gh-switch current
```

**Switch to the correct account:**
```bash
gh-switch use work
```

**For existing repos, set local config:**
```bash
cd your-repo
git config user.name "Your Name"
git config user.email "your@email.com"
```

### ❌ Clone Failed

1. **Verify SSH connection:**
   ```bash
   gh-switch verify work
   ```

2. **Check the profile exists:**
   ```bash
   gh-switch list
   ```

3. **Supported URL formats:**
   - `https://github.com/user/repo.git`
   - `git@github.com:user/repo.git`

---

## Configuration Files

### `~/.gh-switch/config.json`
Stores your account profiles:

```json
{
  "profiles": [
    {
      "name": "personal",
      "gitName": "John Doe",
      "gitEmail": "john@personal.com",
      "githubUsername": "johndoe",
      "sshKeyPath": "/Users/john/.ssh/id_ed25519_personal",
      "sshHost": "github.com-personal"
    }
  ],
  "activeProfile": "personal",
  "version": "1.0.0"
}
```

### `~/.ssh/config`
Automatically managed SSH host aliases:

```
# --- gh-switch managed entries START ---
Host github.com-personal
  HostName github.com
  User git
  IdentityFile /Users/john/.ssh/id_ed25519_personal
  IdentitiesOnly yes

Host github.com-work
  HostName github.com
  User git
  IdentityFile /Users/john/.ssh/id_ed25519_work
  IdentitiesOnly yes
# --- gh-switch managed entries END ---
```

---

## Advanced

### Manual SSH Key Generation

If you prefer to generate SSH keys manually:

```bash
# For personal account
ssh-keygen -t ed25519 -C "personal@email.com" -f ~/.ssh/id_ed25519_personal

# For work account
ssh-keygen -t ed25519 -C "work@email.com" -f ~/.ssh/id_ed25519_work
```

Then add the public key to GitHub:
```bash
cat ~/.ssh/id_ed25519_personal.pub
# Copy output to GitHub → Settings → SSH and GPG keys
```

### Uninstallation

```bash
npm uninstall -g @eshan.rajapakshe/gh-switch

# Optionally remove config
rm -rf ~/.gh-switch
```

Note: `~/.ssh/config` entries remain. Remove them manually if needed.

---

## Development

### Local Setup

```bash
git clone <repo-url>
cd gh-switch
npm install
npm run build
npm link
```

### Project Structure

```
src/
├── commands/        # Command implementations
├── config/          # Configuration management
├── types/           # TypeScript types
├── utils/           # Utility functions
└── index.ts         # CLI entry point
```

### Build & Test

```bash
npm run build    # Compile TypeScript
npm run dev      # Development mode
```

---

## License

MIT

## Contributing

Contributions welcome! Submit a Pull Request or open an issue.

## Support

Having issues? [Open an issue](https://github.com/your-repo/gh-switch/issues) on GitHub.
