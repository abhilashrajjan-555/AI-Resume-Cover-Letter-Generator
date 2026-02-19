# AI Resume & Cover Letter Generator

[![Node.js >=18](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

Generate ATS-friendly, role-tailored resumes and cover letters from one structured form, then export both as PDFs.

## Why This Project

This application is designed as a practical full-stack tool for job seekers:

- Collects candidate background via a simple web interface
- Produces targeted resume and cover letter text using an LLM
- Generates downloadable PDF documents server-side
- Supports OpenRouter-first configuration with OpenAI fallback

## Core Features

- Single-submit workflow for both documents
- Clean JSON API (`POST /api/generate-documents`)
- PDF export with user-friendly file naming
- Input normalization and required-field validation
- Rate limiting and security headers enabled by default
- Request ID returned on errors for easier troubleshooting

## Tech Stack

- Backend: Node.js, Express
- AI integration: `openai` SDK (OpenAI-compatible; supports OpenRouter)
- Document rendering: PDFKit
- Frontend: Vanilla HTML, CSS, and JavaScript
- Security middleware: Helmet + `express-rate-limit`

## Project Structure

```text
.
|-- public/
|   |-- index.html
|   |-- app.js
|   `-- styles.css
|-- src/
|   |-- server.js
|   `-- services/
|       `-- documentService.js
|-- .env.example
`-- README.md
```

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create environment file:
   ```bash
   cp .env.example .env
   ```
3. Add your API key(s) in `.env`:
   - `OPENROUTER_API_KEY` (recommended), or
   - `OPENAI_API_KEY` (fallback provider)
4. Start the server:
   ```bash
   npm start
   ```
5. Open `http://localhost:3000`

## Environment Variables

Required (choose one provider):

- `OPENROUTER_API_KEY`
- `OPENAI_API_KEY`

Optional:

- `OPENROUTER_BASE_URL` (default: `https://openrouter.ai/api/v1`)
- `OPENROUTER_MODEL` (example: `openai/gpt-4o-mini`)
- `OPENROUTER_SITE_URL`
- `OPENROUTER_APP_NAME`
- `OPENAI_MODEL`
- `PORT` (default: `3000`)

## API Contract

### `POST /api/generate-documents`

Request body (minimum required fields):

```json
{
  "fullName": "Jane Doe",
  "desiredRole": "Software Engineer",
  "experienceSummary": "5 years building full-stack applications"
}
```

Successful response includes:

- `resumeText`
- `coverLetterText`
- `resumePdfBase64`
- `coverLetterPdfBase64`
- `resumeFileName`
- `coverLetterFileName`
- `provider`
- `model`

## Quality Checks

Run local quality checks:

```bash
npm run check
```

Run test command (currently mapped to syntax checks):

```bash
npm test
```

## Security Notes

- `.env` files are ignored by git
- API requests are rate-limited (`30 req / 15 min / IP`)
- Security headers are set through Helmet
- Provider/internal errors are sanitized before returning to clients

## Professional Repository Standards

This repository includes:

- `LICENSE` (MIT)
- `CONTRIBUTING.md`
- `SECURITY.md`
- GitHub Actions CI workflow

## Roadmap

- Add unit/integration tests for prompt parsing and API validation
- Add Docker support for one-command deployment
- Add persistent template presets for different career tracks

## License

Released under the MIT License. See [LICENSE](./LICENSE).
