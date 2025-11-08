# Publishing gh-switch to npm

This guide will walk you through publishing gh-switch to npm.

## Prerequisites

1. **npm account**: Create one at [https://www.npmjs.com/signup](https://www.npmjs.com/signup)
2. **Verified email**: Make sure your npm email is verified
3. **Two-factor authentication** (recommended): Enable 2FA for security

## Step-by-Step Publishing Guide

### 1. Prepare Your Package

#### Update package.json

Open `package.json` and update the following fields:

```json
{
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/gh-switch.git"
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/gh-switch/issues"
  },
  "homepage": "https://github.com/YOUR_USERNAME/gh-switch#readme"
}
```

Replace:
- `Your Name <your.email@example.com>` with your name and email
- `YOUR_USERNAME` with your GitHub username

#### Check Package Name Availability

Before publishing, check if the package name is available:

```bash
npm search gh-switch
```

If the name is taken, you'll need to either:
- Choose a different name (e.g., `@your-username/gh-switch`)
- Contact npm support if you believe you have rights to the name

### 2. Create a GitHub Repository

```bash
# Initialize git repository (if not already done)
cd D:\Repos\gh-switch
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial release v1.0.0

Features:
- Smart account management with auto-detection
- Intelligent SSH key generation and management
- Duplicate SSH key detection
- Automatic SSH config management
- Cross-platform support"

# Create GitHub repository first, then:
git remote add origin https://github.com/YOUR_USERNAME/gh-switch.git
git branch -M main
git push -u origin main
```

### 3. Build the Project

Ensure the project builds successfully:

```bash
npm run build
```

This will create the `dist/` directory with compiled JavaScript.

### 4. Test Locally

Test that your package works as expected:

```bash
# Install dependencies
npm install

# Link globally for local testing
npm link

# Test the CLI
gh-switch --help
gh-switch init

# Unlink when done testing
npm unlink -g gh-switch
```

### 5. Login to npm

```bash
npm login
```

You'll be prompted for:
- Username
- Password
- Email
- One-time password (if 2FA is enabled)

Verify you're logged in:

```bash
npm whoami
```

### 6. Publish to npm

#### First Time Publishing

```bash
npm publish
```

If you want to publish as a scoped package (recommended for new packages):

```bash
# Update package.json name to "@your-username/gh-switch"
npm publish --access public
```

#### What Happens During Publishing

The `prepare` script in `package.json` automatically runs `npm run build` before publishing, so your TypeScript code will be compiled.

Files that will be published:
- `dist/` (compiled JavaScript)
- `README.md`
- `LICENSE`
- `package.json`
- `CHANGELOG.md`

Files that will be ignored (via .gitignore):
- `node_modules/`
- `src/` (TypeScript source - not needed, dist is included)
- `.git/`

### 7. Verify Publication

After publishing, verify your package:

```bash
# Search for your package
npm search gh-switch

# View package info
npm info gh-switch

# Install globally to test
npm install -g gh-switch

# Test it
gh-switch --help
```

### 8. Add npm Badge to README

Add this badge to your README.md:

```markdown
[![npm version](https://badge.fury.io/js/gh-switch.svg)](https://www.npmjs.com/package/gh-switch)
[![npm downloads](https://img.shields.io/npm/dm/gh-switch.svg)](https://www.npmjs.com/package/gh-switch)
```

## Publishing Updates

### Versioning

Follow [Semantic Versioning](https://semver.org/):

- **Patch** (1.0.0 → 1.0.1): Bug fixes
- **Minor** (1.0.0 → 1.1.0): New features (backward compatible)
- **Major** (1.0.0 → 2.0.0): Breaking changes

### Update Version

```bash
# Patch release (bug fixes)
npm version patch

# Minor release (new features)
npm version minor

# Major release (breaking changes)
npm version major
```

This will:
1. Update `package.json` version
2. Create a git commit
3. Create a git tag

### Publish Update

```bash
# Build the project
npm run build

# Publish
npm publish

# Push tags to GitHub
git push --follow-tags
```

## Troubleshooting

### Package Name Already Exists

```bash
# Option 1: Use scoped package
# Update package.json: "name": "@your-username/gh-switch"
npm publish --access public

# Option 2: Choose a different name
# Update package.json: "name": "github-account-switch"
npm publish
```

### Authentication Errors

```bash
# Re-login
npm logout
npm login

# Check authentication
npm whoami
```

### Build Errors Before Publishing

```bash
# Clean build
rm -rf dist node_modules
npm install
npm run build
```

### Testing Before Publishing

```bash
# Create a tarball (doesn't publish)
npm pack

# This creates gh-switch-1.0.0.tgz
# Install it locally to test
npm install -g ./gh-switch-1.0.0.tgz

# Test
gh-switch --help

# Cleanup
npm uninstall -g gh-switch
rm gh-switch-1.0.0.tgz
```

## Post-Publishing Checklist

- [ ] Package appears on npm: https://www.npmjs.com/package/gh-switch
- [ ] README displays correctly on npm
- [ ] Installation works: `npm install -g gh-switch`
- [ ] CLI works after global installation
- [ ] Create a GitHub release with tag
- [ ] Tweet about it / share on social media
- [ ] Add to awesome lists (awesome-cli, awesome-github, etc.)

## Additional Resources

- [npm Documentation](https://docs.npmjs.com/)
- [Publishing npm packages](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
- [npm Best Practices](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry#best-practices)

## Support

If you encounter issues:
- Check [npm status](https://status.npmjs.org/)
- Visit [npm support](https://www.npmjs.com/support)
- Ask in [npm community](https://npm.community/)
