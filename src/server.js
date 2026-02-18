require("dotenv").config();

const express = require("express");
const path = require("path");
const { generateDocuments } = require("./services/documentService");

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/generate-documents", async (req, res) => {
  const {
    fullName,
    desiredRole,
    experienceSummary,
    previousRoles,
    skills,
    education,
    achievements,
    targetCompany
  } = req.body || {};

  if (!fullName || !desiredRole || !experienceSummary) {
    return res.status(400).json({
      error:
        "Missing required fields. Please provide fullName, desiredRole, and experienceSummary."
    });
  }

  try {
    const result = await generateDocuments({
      fullName,
      desiredRole,
      experienceSummary,
      previousRoles,
      skills,
      education,
      achievements,
      targetCompany
    });
    return res.json(result);
  } catch (error) {
    const message =
      error && typeof error.message === "string"
        ? error.message
        : "Failed to generate documents.";
    return res.status(500).json({ error: message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
