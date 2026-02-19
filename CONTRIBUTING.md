# Contributing Guide

Thanks for your interest in improving this project.

## Development Setup

1. Fork the repository and clone your fork.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your environment file:
   ```bash
   cp .env.example .env
   ```
4. Start the app:
   ```bash
   npm run dev
   ```

## Branching and Commits

- Use focused branches per change
- Keep commits small and descriptive
- Follow conventional, imperative commit messages (for example: `Add input validation for target company field`)

## Pull Request Checklist

- `npm run check` passes locally
- Changes include documentation updates when behavior changes
- No secrets or local environment values are committed
- PR description explains purpose, approach, and testing evidence

## Code Style

- Keep functions small and explicit
- Prefer clear names over clever shortcuts
- Handle errors with actionable, user-safe messages
