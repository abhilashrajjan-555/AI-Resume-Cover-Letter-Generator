# AI Resume & Cover Letter Generator

Generate tailored, ATS-friendly job documents from a simple form.

## About
AI Resume & Cover Letter Generator helps job seekers create role-specific application documents in minutes. Users provide their experience, target role, and key qualifications, and the app generates a polished resume and matching cover letter that can be downloaded as PDFs.

Users enter:
- Experience summary
- Desired role
- Skills, past roles, education, achievements
- Optional target company

The app returns:
- Tailored resume text + downloadable PDF
- Tailored cover letter text + downloadable PDF

## Features
- Fast web form UI for candidate details
- AI-generated resume and cover letter with role-specific tailoring
- Automatic PDF rendering for both documents
- Browser download buttons for generated files
- OpenRouter-first configuration with optional OpenAI fallback

## Tech Stack
- Node.js + Express
- `openai` SDK (OpenAI-compatible, configured for OpenRouter)
- PDFKit for server-side PDF generation
- Vanilla HTML/CSS/JS frontend

## Project Structure
```text
src/
  server.js
  services/documentService.js
public/
  index.html
  app.js
  styles.css
```

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create your environment file:
   ```bash
   cp .env.example .env
   ```
3. Add your OpenRouter API key in `.env`.
4. Start the server:
   ```bash
   npm start
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables
- `OPENROUTER_API_KEY`: required for OpenRouter usage
- `OPENROUTER_BASE_URL`: default `https://openrouter.ai/api/v1`
- `OPENROUTER_MODEL`: example `openai/gpt-4o-mini`
- `OPENROUTER_SITE_URL`: optional referer header
- `OPENROUTER_APP_NAME`: optional app name header
- `PORT`: default `3000`

Optional fallback:
- `OPENAI_API_KEY`
- `OPENAI_MODEL`

## API
- `POST /api/generate-documents`
  - Required fields:
    - `fullName`
    - `desiredRole`
    - `experienceSummary`
  - Returns:
    - `resumeText`
    - `coverLetterText`
    - `resumePdfBase64`
    - `coverLetterPdfBase64`
    - file names for both PDFs

## Security
- `.env` and `.env.*` are git-ignored.
- `.env.example` is the only environment template tracked in git.
- Never commit real API keys.
- API requests are rate-limited (`30 requests / 15 minutes / IP`).
- Security headers are enabled via `helmet`.
- Server responses avoid leaking raw provider/internal errors.
