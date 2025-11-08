# gh-switch Examples

This document provides practical examples of using gh-switch in real-world scenarios.

## Scenario 1: Setting Up for the First Time

You have two GitHub accounts:
- Personal account: `johndoe` with email `john@personal.com` and SSH key at `~/.ssh/id_rsa_personal`
- Work account: `jdoe-work` with email `john@company.com` and SSH key at `~/.ssh/id_rsa_work`

### Steps:

```bash
# 1. Initialize with your personal account
$ gh-switch init

🚀 Welcome to gh-switch!

This wizard will help you set up your first GitHub account profile.

📋 Detected existing Git configuration:
  Name: John Doe
  Email: john@personal.com

🔑 Found 2 SSH key(s) in ~/.ssh/

Let's add your first GitHub account...

? Profile name (e.g., personal, work): (personal) personal
? Git user name: (John Doe) John Doe
? Git user email: (john@personal.com) john@personal.com
? GitHub username: johndoe
? Select SSH private key: (Use arrow keys)
❯ id_ed25519_personal ✓ (has .pub)
  id_rsa_personal ✓ (has .pub)
  id_rsa ✓ (has .pub)
  Enter custom path...

✅ Profile added successfully!

# 2. Add your work account
$ gh-switch add

➕ Add a new GitHub account profile

📋 Current Git configuration:
  Name: John Doe
  Email: john@personal.com
  (You can use different values for this profile)

🔑 Found 2 SSH key(s) in ~/.ssh/

? Profile name (e.g., personal, work): work
? Git user name: (John Doe) John Doe
? Git user email: (john@personal.com) john@company.com
? GitHub username: jdoe-work
? Select SSH private key: (Use arrow keys)
  id_ed25519_personal ✓ (has .pub)
❯ id_rsa_work ✓ (has .pub)
  id_rsa ✓ (has .pub)
  Enter custom path...

✅ Profile added successfully!

# 3. Verify both accounts
$ gh-switch verify

🔍 Verifying SSH connections to GitHub...

Testing personal (johndoe)...
  ✅ Success: Hi johndoe! You've successfully authenticated...

Testing work (jdoe-work)...
  ✅ Success: Hi jdoe-work! You've successfully authenticated...

Summary:
  ✅ Successful: 2
  ❌ Failed: 0
```

## Scenario 2: Daily Workflow - Switching Between Accounts

### Working on Personal Projects

```bash
# Switch to personal account
$ gh-switch use personal

✅ Switched to profile: personal

Global git config updated:
  user.name: John Doe
  user.email: john@personal.com
  GitHub: johndoe
  SSH Host: github.com-personal

# Clone a personal repository
$ gh-switch clone https://github.com/johndoe/my-blog.git

📥 Cloning repository...

  Repository: https://github.com/johndoe/my-blog.git
  Profile: personal (johndoe)
  SSH Host: github.com-personal

✅ Repository cloned successfully!

# Work on your project
$ cd my-blog
$ git add .
$ git commit -m "Update blog post"
$ git push
```

### Switching to Work Projects

```bash
# Switch to work account
$ gh-switch use work

✅ Switched to profile: work

Global git config updated:
  user.name: John Doe
  user.email: john@company.com
  GitHub: jdoe-work

# Clone a work repository
$ gh-switch clone https://github.com/company/backend-api.git

📥 Cloning repository...

  Repository: https://github.com/company/backend-api.git
  Profile: work (jdoe-work)
  SSH Host: github.com-work

✅ Repository cloned successfully!

# Work on the project
$ cd backend-api
$ git add .
$ git commit -m "Fix authentication bug"
$ git push
```

## Scenario 3: Checking Your Current Configuration

```bash
# See what account you're currently using
$ gh-switch current

📌 Current Configuration

Active Profile:
  Name: work
  GitHub: jdoe-work
  Email: john@company.com
  SSH Host: github.com-work
  SSH Key: /Users/john/.ssh/id_rsa_work

Global Git Config:
  user.name: John Doe
  user.email: john@company.com
```

## Scenario 4: Listing All Profiles

```bash
$ gh-switch list

📋 GitHub Account Profiles (2)

  personal
    GitHub: johndoe
    Email: john@personal.com
    SSH Host: github.com-personal

● work
    GitHub: jdoe-work
    Email: john@company.com
    SSH Host: github.com-work
    [ACTIVE]

Currently active: work
```

## Scenario 5: Cloning with Interactive Selection

```bash
# Clone without specifying a profile
$ gh-switch clone https://github.com/username/some-repo.git

? Clone with profile "work" (jdoe-work - john@company.com)? (Y/n) n
? Select a profile to use: (Use arrow keys)
❯ personal (johndoe - john@personal.com)
  work (jdoe-work - john@company.com)
```

## Scenario 6: Removing an Old Profile

```bash
$ gh-switch remove old-account

⚠️  You are about to remove the following profile:

  Name: old-account
  GitHub: old-username
  Email: old@email.com
  SSH Host: github.com-old-account

? Are you sure you want to remove this profile? (y/N) y

✅ Profile removed successfully!

SSH config entry has been removed.
The SSH key file itself has not been deleted.
```

## Scenario 7: Verifying a Specific Profile

```bash
# Test SSH connection for a specific profile
$ gh-switch verify personal

🔍 Verifying SSH connections to GitHub...

Testing personal (johndoe)...
  ✅ Success: Hi johndoe! You've successfully authenticated, but GitHub does not provide shell access.

Summary:
  ✅ Successful: 1
  ❌ Failed: 0
```

## Scenario 8: Viewing and Editing Configuration

```bash
# View configuration
$ gh-switch config

⚙️  Configuration

Configuration File:
  /Users/john/.gh-switch/config.json

Profiles:
● personal
    GitHub: johndoe
    Email: john@personal.com
    SSH Host: github.com-personal
    SSH Key: /Users/john/.ssh/id_rsa_personal
  work
    GitHub: jdoe-work
    Email: john@company.com
    SSH Host: github.com-work
    SSH Key: /Users/john/.ssh/id_rsa_work

Active Profile:
  personal

💡 Tip: Use "gh-switch config --edit" to edit the configuration file.

# Edit configuration directly
$ gh-switch config --edit
# Opens the config file in your default editor
```

## Scenario 9: Cloning to a Specific Directory

```bash
# Clone to a custom directory
$ gh-switch clone https://github.com/company/project.git work my-custom-folder

📥 Cloning repository...

  Repository: https://github.com/company/project.git
  Profile: work (jdoe-work)
  SSH Host: github.com-work

✅ Repository cloned successfully!

Directory: /Users/john/projects/my-custom-folder
```

## Scenario 10: Troubleshooting Failed SSH Connection

```bash
$ gh-switch verify personal

🔍 Verifying SSH connections to GitHub...

Testing personal (johndoe)...
  ❌ Failed: Permission denied (publickey).

Summary:
  ✅ Successful: 0
  ❌ Failed: 1

💡 Troubleshooting tips:
  1. Ensure your SSH key is added to your GitHub account
  2. Check that the SSH key path in your profile is correct
  3. Verify SSH key permissions (should be 600 or 400)
  4. Test manually: ssh -T git@github.com-personal

# Fix: Check the SSH key path
$ gh-switch config

# Fix: Add public key to GitHub
$ cat ~/.ssh/id_rsa_personal.pub
# Copy output and add to GitHub Settings → SSH and GPG keys

# Verify again
$ gh-switch verify personal
```

## Tips and Tricks

### 1. Quick Switch
```bash
# Quickly switch between your most-used profiles
alias ghp="gh-switch use personal"
alias ghw="gh-switch use work"
```

### 2. Pre-Clone Verification
```bash
# Always verify before cloning
gh-switch verify work && gh-switch clone https://github.com/company/repo.git work
```

### 3. Check Before Commit
```bash
# Create an alias to always check current profile
alias gcheck="gh-switch current"
```

### 4. Batch Operations
```bash
# Switch and clone in one go
gh-switch use personal && gh-switch clone https://github.com/johndoe/project.git
```

## Common Workflows

### Morning Routine (Work)
```bash
gh-switch use work
gh-switch current
cd ~/work-projects
```

### Evening Routine (Personal)
```bash
gh-switch use personal
gh-switch current
cd ~/personal-projects
```

### Contributing to Open Source
```bash
# Use personal account for open source contributions
gh-switch use personal
gh-switch clone https://github.com/some-org/open-source-project.git
```
