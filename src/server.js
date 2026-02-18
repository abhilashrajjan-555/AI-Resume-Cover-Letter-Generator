require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const crypto = require("crypto");
const { generateDocuments } = require("./services/documentService");

const app = express();
const port = Number(process.env.PORT || 3000);

const MAX_LENGTHS = {
  fullName: 120,
  desiredRole: 160,
  experienceSummary: 3000,
  previousRoles: 2500,
  skills: 1800,
  education: 1200,
  achievements: 1800,
  targetCompany: 160
};

app.disable("x-powered-by");
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "script-src": ["'self'"],
        "style-src": ["'self'"],
        "connect-src": ["'self'"],
        "img-src": ["'self'", "data:"]
      }
    }
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests. Try again in a few minutes." }
  })
);

function normalizeField(value, maxLen) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, maxLen);
}

function validatePayload(body) {
  const payload = {
    fullName: normalizeField(body.fullName, MAX_LENGTHS.fullName),
    desiredRole: normalizeField(body.desiredRole, MAX_LENGTHS.desiredRole),
    experienceSummary: normalizeField(
      body.experienceSummary,
      MAX_LENGTHS.experienceSummary
    ),
    previousRoles: normalizeField(body.previousRoles, MAX_LENGTHS.previousRoles),
    skills: normalizeField(body.skills, MAX_LENGTHS.skills),
    education: normalizeField(body.education, MAX_LENGTHS.education),
    achievements: normalizeField(body.achievements, MAX_LENGTHS.achievements),
    targetCompany: normalizeField(body.targetCompany, MAX_LENGTHS.targetCompany)
  };

  if (!payload.fullName || !payload.desiredRole || !payload.experienceSummary) {
    return {
      ok: false,
      error:
        "Missing required fields. Please provide fullName, desiredRole, and experienceSummary."
    };
  }

  return { ok: true, payload };
}

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/generate-documents", async (req, res) => {
  const requestId = crypto.randomUUID();
  const validation = validatePayload(req.body || {});
  if (!validation.ok) {
    return res.status(400).json({ error: validation.error, requestId });
  }

  try {
    const result = await generateDocuments(validation.payload);
    return res.json(result);
  } catch (error) {
    const rawMessage =
      error && typeof error.message === "string" ? error.message : "";
    const status = Number(error && error.status);
    const isAuthIssue = status === 401 || status === 403;
    const isConfigIssue =
      rawMessage.includes("Missing API key") || rawMessage.includes("API key");

    console.error("[generate-documents:error]", {
      requestId,
      status: status || 500,
      message: rawMessage || "Unknown error"
    });

    if (isConfigIssue) {
      return res.status(500).json({
        error: "Server configuration issue. Please contact support.",
        requestId
      });
    }

    if (isAuthIssue) {
      return res.status(502).json({
        error: "AI provider authentication failed. Please try again later.",
        requestId
      });
    }

    return res.status(502).json({
      error: "Failed to generate documents right now. Please try again.",
      requestId
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
