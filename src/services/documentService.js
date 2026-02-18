const OpenAI = require("openai");
const PDFDocument = require("pdfkit");

function getClientConfig() {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;

  if (openRouterKey) {
    const headers = {};
    if (process.env.OPENROUTER_SITE_URL) {
      headers["HTTP-Referer"] = process.env.OPENROUTER_SITE_URL;
    }
    if (process.env.OPENROUTER_APP_NAME) {
      headers["X-Title"] = process.env.OPENROUTER_APP_NAME;
    }

    return {
      provider: "openrouter",
      model:
        process.env.OPENROUTER_MODEL ||
        process.env.OPENAI_MODEL ||
        "openai/gpt-4o-mini",
      client: new OpenAI({
        apiKey: openRouterKey,
        baseURL:
          process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
        defaultHeaders: headers
      })
    };
  }

  if (openAiKey) {
    return {
      provider: "openai",
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      client: new OpenAI({ apiKey: openAiKey })
    };
  }

  throw new Error(
    "Missing API key. Set OPENROUTER_API_KEY (recommended) or OPENAI_API_KEY in .env."
  );
}

function safeValue(value) {
  return value && String(value).trim() ? String(value).trim() : "Not provided";
}

function buildPrompt(data) {
  return `
Use create-document style output quality for professional job application writing.

Candidate Details:
- Full Name: ${safeValue(data.fullName)}
- Desired Role: ${safeValue(data.desiredRole)}
- Experience Summary: ${safeValue(data.experienceSummary)}
- Previous Roles: ${safeValue(data.previousRoles)}
- Skills: ${safeValue(data.skills)}
- Education: ${safeValue(data.education)}
- Achievements: ${safeValue(data.achievements)}
- Target Company: ${safeValue(data.targetCompany)}

Instructions:
1) Create a tailored, ATS-friendly resume text for the desired role.
2) Create a tailored cover letter text for the same role and target company.
3) Keep claims realistic and grounded in supplied details.
4) Resume should include clear sections and bullet points.
5) Cover letter should be concise and persuasive.

Return output in this exact format:
<resume>
[resume text only]
</resume>
<cover_letter>
[cover letter text only]
</cover_letter>
`.trim();
}

function extractOutputText(response) {
  const raw = response?.choices?.[0]?.message?.content;
  if (typeof raw === "string" && raw.trim()) {
    return raw;
  }

  if (Array.isArray(raw)) {
    const merged = raw
      .map((part) => {
        if (typeof part === "string") return part;
        if (typeof part?.text === "string") return part.text;
        if (typeof part?.text?.value === "string") return part.text.value;
        return "";
      })
      .join("\n")
      .trim();
    if (merged) {
      return merged;
    }
  }

  throw new Error("Model returned an unexpected response format.");
}

function parseTaggedSections(rawText) {
  const resumeMatch = rawText.match(/<resume>([\s\S]*?)<\/resume>/i);
  const coverLetterMatch = rawText.match(
    /<cover_letter>([\s\S]*?)<\/cover_letter>/i
  );

  if (!resumeMatch || !coverLetterMatch) {
    throw new Error(
      "The generated content was not in the expected format. Please try again."
    );
  }

  return {
    resumeText: resumeMatch[1].trim(),
    coverLetterText: coverLetterMatch[1].trim()
  };
}

function makeFileName(baseName, suffix) {
  const normalized = String(baseName || "candidate")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${normalized || "candidate"}-${suffix}.pdf`;
}

function renderPdf({ title, content }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "LETTER",
      margin: 56
    });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.font("Helvetica-Bold").fontSize(18).text(title, { align: "center" });
    doc.moveDown(1.2);
    doc.font("Helvetica").fontSize(11).text(content, {
      lineGap: 4,
      align: "left"
    });

    doc.end();
  });
}

async function generateDocuments(userInput) {
  const { client, model, provider } = getClientConfig();

  const response = await client.chat.completions.create({
    model,
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content:
          "You are an expert resume and cover letter writer. Follow the user's format instructions exactly."
      },
      {
        role: "user",
        content: buildPrompt(userInput)
      }
    ]
  });

  const rawText = extractOutputText(response);
  const { resumeText, coverLetterText } = parseTaggedSections(rawText);

  const [resumePdf, coverLetterPdf] = await Promise.all([
    renderPdf({
      title: `${userInput.fullName} - Tailored Resume`,
      content: resumeText
    }),
    renderPdf({
      title: `${userInput.fullName} - Cover Letter`,
      content: coverLetterText
    })
  ]);

  return {
    provider,
    model,
    resumeText,
    coverLetterText,
    resumeFileName: makeFileName(userInput.fullName, "resume"),
    coverLetterFileName: makeFileName(userInput.fullName, "cover-letter"),
    resumePdfBase64: resumePdf.toString("base64"),
    coverLetterPdfBase64: coverLetterPdf.toString("base64")
  };
}

module.exports = { generateDocuments };
