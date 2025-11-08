# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-11-08

### Added

#### Intelligent SSH Key Management (NEW!)
- **Duplicate SSH Key Detection**: Automatically detects when an SSH key is already in use by another profile
- **Automatic SSH Key Generation**: Generates new Ed25519 SSH keys when duplicates are detected
- **Interactive Public Key Display**: Shows generated public keys in a copyable format with clear instructions
- **Guided GitHub Setup**: Waits for user confirmation after adding keys to GitHub
- **Secure Key Generation**: Uses Ed25519 algorithm (more secure than RSA)
- **Smart Key Naming**: Automatically names keys based on profile (e.g., `id_ed25519_personal`)

#### Smart Auto-Detection Features
- **Git Configuration Detection**: Automatically detects existing global Git configuration (user.name and user.email) and uses them as defaults during profile setup
- **SSH Key Scanning**: Automatically scans `~/.ssh/` directory and presents available SSH keys as selectable options
- **SSH Key Intelligence**:
  - Detects common SSH key types (RSA, Ed25519, ECDSA, DSA)
  - Highlights keys with corresponding `.pub` files with a ✓ indicator
  - Prioritizes Ed25519 keys over RSA (recommended for security)
  - Provides "Enter custom path..." option for manual path entry
- **Smart Defaults**: Pre-fills detected values in interactive prompts, allowing users to press Enter to accept or type to override

#### Core Features
- Multiple GitHub account profile management
- Automatic SSH configuration management in `~/.ssh/config`
- Profile switching with global git config updates
- Repository cloning with profile-specific credentials
- SSH connection verification
- Interactive CLI with colored output
- Cross-platform support (Windows, macOS, Linux)

#### Commands
- `gh-switch init` - Initialize with first profile (with auto-detection)
- `gh-switch add` - Add new profile (with auto-detection)
- `gh-switch list` - List all profiles
- `gh-switch use <profile>` - Switch active profile
- `gh-switch current` - Show current configuration
- `gh-switch clone <url> [profile]` - Clone with specific profile
- `gh-switch verify [profile]` - Test SSH connections
- `gh-switch remove <profile>` - Remove profile
- `gh-switch config [--edit]` - View/edit configuration

#### Developer Tools
- TypeScript with strict mode
- Comprehensive error handling
- Well-documented code with JSDoc comments
- Modular architecture

#### Documentation
- Comprehensive README with all commands and examples
- EXAMPLES.md with real-world scenarios
- CONTRIBUTING.md for developers
- Auto-detection feature documentation

### Enhanced User Experience
- Reduced manual typing during setup
- Visual indicators for SSH keys with public key files
- Clear detection status messages
- Informative prompts showing current configuration
- Ability to override auto-detected values

### Technical Improvements
- Created `detect-config.ts` utility module for auto-detection
- Enhanced `init.ts` command with smart prompts
- Enhanced `add.ts` command with smart prompts
- SSH key sorting algorithm (Ed25519 first, then RSA)
- Flexible prompt system supporting both list and input types

## Future Enhancements (Planned)

- [ ] Export/import account configurations
- [ ] Set default account for specific directories
- [ ] Automatic tests (unit and integration)
- [ ] Profile templates for quick setup
- [ ] GitHub CLI (gh) integration
- [ ] Support for multiple Git hosting services (GitLab, Bitbucket)
