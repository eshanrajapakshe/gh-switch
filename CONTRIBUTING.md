# Contributing to gh-switch

Thank you for your interest in contributing to gh-switch! This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites

- Node.js v14 or higher
- npm or yarn
- Git
- TypeScript knowledge

### Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/gh-switch.git
   cd gh-switch
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Build the project:
   ```bash
   npm run build
   ```

5. Link for local testing:
   ```bash
   npm link
   ```

## Project Structure

```
gh-switch/
├── src/
│   ├── commands/           # CLI command implementations
│   │   ├── add.ts         # Add new profile
│   │   ├── clone.ts       # Clone repository
│   │   ├── config.ts      # Show/edit config
│   │   ├── current.ts     # Show current profile
│   │   ├── init.ts        # Initialize gh-switch
│   │   ├── list.ts        # List profiles
│   │   ├── remove.ts      # Remove profile
│   │   ├── use.ts         # Switch profiles
│   │   └── verify.ts      # Verify SSH connections
│   ├── config/            # Configuration management
│   │   └── config-manager.ts
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   │   ├── file-operations.ts
│   │   ├── git-operations.ts
│   │   └── ssh-config.ts
│   └── index.ts           # CLI entry point
├── dist/                  # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Development Workflow

### Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following the code style guidelines

3. Build and test your changes:
   ```bash
   npm run build
   ```

4. Test the CLI locally:
   ```bash
   gh-switch <command>
   ```

### Code Style

- Use TypeScript strict mode
- Follow existing code patterns and conventions
- Use meaningful variable and function names
- Add JSDoc comments for public functions
- Keep functions focused and single-purpose
- Handle errors gracefully with user-friendly messages

### TypeScript Guidelines

- Always specify return types for functions
- Avoid using `any` type unless absolutely necessary
- Use interfaces for object shapes
- Leverage type inference where appropriate
- Use async/await for asynchronous operations

### Example Code Style

```typescript
/**
 * Get a profile by name
 * @param profileName - The name of the profile to retrieve
 * @returns The profile if found, null otherwise
 */
export async function getProfile(profileName: string): Promise<Profile | null> {
  const config = await loadConfig();
  return config.profiles.find((p) => p.name === profileName) || null;
}
```

## Adding a New Command

To add a new command to gh-switch:

1. Create a new file in `src/commands/your-command.ts`:

```typescript
import chalk from 'chalk';

export async function yourCommand(): Promise<void> {
  console.log(chalk.blue('Your command output'));
  // Command implementation
}
```

2. Register the command in `src/index.ts`:

```typescript
import { yourCommand } from './commands/your-command';

program
  .command('your-command')
  .description('Description of your command')
  .action(async () => {
    try {
      await yourCommand();
    } catch (error: any) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });
```

3. Update the README.md with documentation for the new command

## Testing

Currently, the project relies on manual testing. When testing your changes:

1. Test the happy path (expected usage)
2. Test edge cases (empty inputs, invalid data, etc.)
3. Test error handling
4. Test on different platforms if possible (Windows, macOS, Linux)

### Manual Testing Checklist

- [ ] Command executes without errors
- [ ] Error messages are clear and helpful
- [ ] User prompts work correctly
- [ ] File operations succeed
- [ ] SSH configuration is properly updated
- [ ] Git operations work as expected
- [ ] Cross-platform compatibility (if applicable)

## Documentation

When adding features or making changes:

1. Update README.md with new commands or options
2. Add examples to EXAMPLES.md
3. Update JSDoc comments in code
4. Document breaking changes clearly

## Commit Messages

Follow conventional commit format:

```
type(scope): subject

body

footer
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(clone): add support for custom destination directory

Allows users to specify a custom directory name when cloning repositories.

Closes #123
```

```
fix(verify): handle timeout errors gracefully

Previously, SSH connection timeouts would crash the application.
Now shows a user-friendly error message.
```

## Pull Request Process

1. Ensure your code builds without errors:
   ```bash
   npm run build
   ```

2. Update documentation as needed

3. Create a pull request with:
   - Clear title and description
   - Link to related issues
   - Screenshots/examples if UI changes
   - List of changes made

4. Address review feedback promptly

5. Ensure all discussions are resolved before merge

## Reporting Bugs

When reporting bugs, please include:

1. **Description**: Clear description of the bug
2. **Steps to Reproduce**: Detailed steps to reproduce the issue
3. **Expected Behavior**: What you expected to happen
4. **Actual Behavior**: What actually happened
5. **Environment**:
   - OS and version
   - Node.js version
   - gh-switch version
6. **Screenshots/Logs**: If applicable

Example:

```markdown
### Description
The `gh-switch verify` command times out on Windows.

### Steps to Reproduce
1. Run `gh-switch verify personal`
2. Wait for 10 seconds

### Expected Behavior
Should verify SSH connection and show success/failure message.

### Actual Behavior
Command hangs and eventually times out.

### Environment
- OS: Windows 11
- Node.js: v18.0.0
- gh-switch: v1.0.0

### Logs
[Attach relevant logs or error messages]
```

## Feature Requests

When requesting features:

1. Describe the feature clearly
2. Explain the use case and benefits
3. Provide examples of how it would work
4. Consider implementation complexity

## Code Review Guidelines

When reviewing pull requests:

1. Be respectful and constructive
2. Focus on code quality and maintainability
3. Check for edge cases and error handling
4. Verify documentation is updated
5. Test the changes locally if possible

## Release Process

(For maintainers)

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create a git tag
4. Publish to npm:
   ```bash
   npm publish
   ```

## Questions?

If you have questions about contributing:

1. Check existing issues and pull requests
2. Read the documentation thoroughly
3. Open a new issue with the `question` label

## License

By contributing to gh-switch, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to gh-switch!
