# Contributing to nodejs-api-docgen

Thank you for your interest in contributing! Your contributions will make this project much more perfect. Here are the basic guidelines to get you started.

## Local Setup

To test and modify the CLI tool locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/nnxi/nodejs-api-docgen.git
   cd nodejs-api-docgen
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Link the package locally to use the `api-docgen` command anywhere during development:
   ```bash
   npm link
   ```

## Bug Reports & Issues

Before opening a new issue or bug report, please carefully read the guide located at `issues/README.md`. 

## Pull Requests

When submitting a Pull Request, please follow these rules:

* **Branching:** Create a new branch for your feature or bugfix (e.g., `feature/new-export`, `bugfix/path-error`).
* **Commit Messages & PR Titles:** Must start with a capitalized verb.
  * Good: `Fix invalid path reference in extractor`
  * Good: `Add support for typescript files`
  * Bad: `fixed bug`, `updating readme`
* **Code Style:** Please maintain the existing code style and ensure your changes do not break the core AST parsing logic.
