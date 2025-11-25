# Contributing to Node.js Hello World

Thank you for your interest in contributing to the Node.js Hello World project! This document provides guidelines and instructions for contributing.

## Code of Conduct

This project adheres to the Contributor Covenant Code of Conduct. By participating, you are expected to uphold this code. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details.

## How Can I Contribute?

There are many ways to contribute to the Node.js Hello World project:

- Reporting bugs
- Suggesting enhancements
- Submitting pull requests
- Improving documentation
- Providing feedback

Even as a simple educational project, contributions that improve clarity, functionality, or educational value are welcome.

## Getting Started

### Prerequisites

- Node.js 18.x LTS or higher
- npm 8.x or higher (included with Node.js)
- Git

### Setup

1. Fork the repository on GitHub
2. Clone your fork locally
   ```bash
   git clone https://github.com/your-username/nodejs-hello-world.git
   cd nodejs-hello-world
   ```
3. Add the original repository as an upstream remote
   ```bash
   git remote add upstream https://github.com/original-owner/nodejs-hello-world.git
   ```
4. Install dependencies
   ```bash
   npm install
   ```

See the [README.md](README.md) for more detailed setup instructions.

## Development Workflow

### Branching Strategy

- `main` branch contains the stable, released code
- Feature branches should be created for new work
- Use descriptive branch names prefixed with the type of change:
  - `feature/` for new features
  - `fix/` for bug fixes
  - `docs/` for documentation changes
  - `test/` for test improvements
  - `refactor/` for code refactoring

Example: `feature/add-health-endpoint`

### Making Changes

1. Create a new branch from `main`
   ```bash
   git checkout main
   git pull upstream main
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Run tests to ensure your changes don't break existing functionality
   ```bash
   npm test
   ```

4. Run linting to ensure code style compliance
   ```bash
   npm run lint
   ```

5. Commit your changes with a descriptive message
   ```bash
   git commit -m "Add feature: description of your changes"
   ```

6. Push your branch to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

7. Create a pull request from your branch to the main repository

## Pull Requests

### Pull Request Process

1. Update the README.md or other documentation with details of changes if appropriate
2. Ensure all tests pass and code meets linting standards
3. The pull request will be reviewed by maintainers
4. Address any feedback or requested changes
5. Once approved, a maintainer will merge your pull request

### Pull Request Guidelines

- Follow the pull request template provided
- Include tests for new features or bug fixes
- Update documentation as needed
- Keep pull requests focused on a single concern
- Maintain the project's code style and quality standards
- Ensure all tests pass before submitting

Pull requests that don't meet these guidelines may need revision before they can be accepted.

## Reporting Bugs

### Bug Report Guidelines

When reporting a bug, please include:

1. A clear, descriptive title
2. Steps to reproduce the issue
3. Expected behavior
4. Actual behavior
5. Environment details (OS, Node.js version, etc.)
6. Any relevant logs or error messages

Use the bug report template provided in the repository by creating a new issue and selecting the bug report template.

## Feature Requests

### Feature Request Guidelines

When suggesting a feature, please include:

1. A clear, descriptive title
2. A detailed description of the proposed feature
3. The problem it solves or value it adds
4. Any implementation ideas you have
5. Whether you're willing to contribute the feature yourself

Use the feature request template provided in the repository by creating a new issue and selecting the feature request template.

## Coding Standards

### JavaScript Style Guide

This project follows a consistent JavaScript style enforced by ESLint and Prettier. The configuration files are included in the repository:

- `.eslintrc.js` - ESLint configuration
- `.prettierrc` - Prettier configuration

Key style points:

- Use 2 spaces for indentation
- Use single quotes for strings
- End statements with semicolons
- No trailing commas in function parameters
- Maximum line length of 100 characters
- Use camelCase for variables and functions
- Use PascalCase for classes
- Use UPPER_CASE for constants

### Documentation

- Use JSDoc comments for functions, classes, and methods
- Keep comments current with code changes
- Write clear, concise comments that explain "why" not just "what"

### Testing

- Write tests for all new features and bug fixes
- Maintain or improve test coverage
- Follow the existing test patterns in the `__tests__` directory
- Tests should be clear and maintainable

## Commit Guidelines

### Commit Message Format

Use a clear and descriptive format for commit messages:

```
<type>: <subject>

<body>

<footer>
```

- **Type**: The type of change (feat, fix, docs, style, refactor, test, chore)
- **Subject**: A concise description of the change
- **Body** (optional): More detailed explanation of the change
- **Footer** (optional): Reference issues or breaking changes

Examples:

```
feat: add health check endpoint

Implements a new /health endpoint that returns server status

Resolves #123
```

```
fix: prevent server crash on invalid URL

Adds proper error handling for malformed URL requests
```

### Commit Best Practices

- Make focused, atomic commits that address a single concern
- Write descriptive commit messages that explain the "why" not just the "what"
- Reference issue numbers in commit messages when applicable
- Keep commits small and manageable

## Review Process

### Code Review Guidelines

All submissions require review before being merged. The review process ensures:

- Code quality and adherence to project standards
- Proper test coverage
- Documentation completeness
- Alignment with project goals

Reviewers will provide feedback and may request changes before approving. This is a normal part of the collaborative development process.

### Responding to Reviews

- Address all reviewer comments and suggestions
- Explain your reasoning if you disagree with a suggestion
- Make requested changes or explain why they shouldn't be made
- Be respectful and collaborative throughout the process

## License

By contributing to this project, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).

## Questions?

If you have any questions about contributing, please open an issue with the label 'question'.