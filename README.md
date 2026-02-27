# AI Resume & Cover Letter Generator

[![Node.js >=18](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

Generate ATS-friendly, role-targeted resumes and cover letters from one structured input form, then export both as PDFs.

## Overview

This project is a practical AI workflow for job-application document generation.

- Accepts candidate and role context from a single web form
- Generates both resume and cover letter text in one request
- Exports downloadable PDF files server-side
- Supports OpenRouter (recommended) and OpenAI-compatible configuration

## Key Features

- Single API endpoint for end-to-end document generation
- Input validation and normalization for cleaner output
- PDF generation with safe file naming
- Built-in security defaults (Helmet + rate limiting)
- Structured error responses with request IDs for debugging

## Tech Stack

- Backend: Node.js, Express
- AI: `openai` SDK with OpenRouter/OpenAI-compatible providers
- PDF Rendering: PDFKit
- Frontend: Vanilla HTML/CSS/JavaScript
- Security: Helmet, express-rate-limit

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
2. Configure environment:
   ```bash
   cp .env.example .env
   ```
3. Add one provider key in `.env`:
   - `OPENROUTER_API_KEY` (recommended), or
   - `OPENAI_API_KEY`
4. Run the app:
   ```bash
   npm start
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Required (at least one):

- `OPENROUTER_API_KEY`
- `OPENAI_API_KEY`

Optional:

- `OPENROUTER_BASE_URL` (default: `https://openrouter.ai/api/v1`)
- `OPENROUTER_MODEL` (example: `openai/gpt-4o-mini`)
- `OPENROUTER_SITE_URL`
- `OPENROUTER_APP_NAME`
- `OPENAI_MODEL`
- `PORT` (default: `3000`)

## API

### `POST /api/generate-documents`

Minimal request body:

```json
{
  "fullName": "Jane Doe",
  "desiredRole": "Software Engineer",
  "experienceSummary": "5 years building web applications"
}
```

Success response includes:

- `resumeText`
- `coverLetterText`
- `resumePdfBase64`
- `coverLetterPdfBase64`
- `resumeFileName`
- `coverLetterFileName`
- `provider`
- `model`

## Development Checks

```bash
npm run check
npm test
```

## Security Notes

- Secrets are loaded from environment variables
- Requests are rate-limited (`30 requests / 15 minutes / IP`)
- Security headers are enabled with Helmet
- Provider/internal errors are sanitized before returning to clients

## Repository Standards

- `LICENSE` (MIT)
- `CONTRIBUTING.md`
- `SECURITY.md`
- GitHub Actions CI workflow

## License

MIT. See [LICENSE](./LICENSE).
