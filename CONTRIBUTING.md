# Contributing to SkillBridge

Thank you for your interest in contributing! This document outlines guidelines to help you get started.

## Getting Started

1. **Fork** the repository and clone your fork locally.
2. Install dependencies for both frontend and backend:
   ```bash
   # Frontend
   cd Frontend && npm install

   # Backend
   cd ../backend && npm install
   ```
3. Copy `.env.example` to `.env` in the `backend/` directory and fill in your values.
4. Start the dev servers:
   ```bash
   # Backend (from /backend)
   npm run dev

   # Frontend (from /Frontend)
   npm run dev
   ```

## Project Structure

```
job-portal-platform/
├── Frontend/          # React + Vite app
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── pages/       # Route-level pages
│       ├── hooks/       # Custom React hooks
│       ├── utils/       # Pure helper functions
│       ├── services/    # API service layer
│       └── context/     # React context providers
└── backend/           # Express + MongoDB API
    ├── models/          # Mongoose schemas
    ├── routes/          # API route handlers
    └── middleware/      # Auth & other middleware
```

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Purpose |
|--------|---------|
| `feat` | New feature |
| `fix` | Bug fix |
| `chore` | Maintenance / tooling |
| `docs` | Documentation only |
| `refactor` | Code change with no feature/fix |
| `style` | Formatting, whitespace |
| `test` | Adding or fixing tests |

Example: `feat(ui): add dark mode toggle to Navbar`

## Pull Request Guidelines

- Keep PRs focused — one feature or fix per PR.
- Write a clear description of *what* and *why*.
- Ensure the app runs without errors before submitting.
- Reference any related issues with `Closes #<issue-number>`.

## Code Style

- **Frontend**: React functional components with hooks; avoid class components.
- **Backend**: Async/await throughout; handle errors with `try/catch`.
- Use meaningful variable names — avoid single-letter vars outside loop counters.

## Reporting Issues

Open a GitHub Issue with:
- A clear title.
- Steps to reproduce.
- Expected vs actual behaviour.
- Screenshots if relevant.

We appreciate every contribution, big or small! 🙌
