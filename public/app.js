const form = document.getElementById("generator-form");
const statusEl = document.getElementById("status");
const resultPanel = document.getElementById("result-panel");
const resumePreview = document.getElementById("resume-preview");
const coverPreview = document.getElementById("cover-preview");
const downloadResumeBtn = document.getElementById("download-resume");
const downloadCoverBtn = document.getElementById("download-cover");
const submitBtn = document.getElementById("submit-btn");

let generated = null;

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
}

function base64ToBlob(base64, type = "application/pdf") {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type });
}

function downloadBase64Pdf(base64, fileName) {
  const blob = base64ToBlob(base64);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  setStatus("Generating tailored resume and cover letter...");
  submitBtn.disabled = true;
  resultPanel.classList.add("hidden");

  try {
    const response = await fetch("/api/generate-documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const isJson = (response.headers.get("content-type") || "").includes(
      "application/json"
    );
    const data = isJson ? await response.json() : { error: await response.text() };
    if (!response.ok) {
      const suffix = data.requestId ? ` (Ref: ${data.requestId})` : "";
      throw new Error((data.error || "Failed to generate documents.") + suffix);
    }

    generated = data;
    resumePreview.textContent = data.resumeText;
    coverPreview.textContent = data.coverLetterText;
    resultPanel.classList.remove("hidden");
    setStatus("Done. Your PDFs are ready.");
  } catch (error) {
    setStatus(error.message || "Something went wrong.", true);
  } finally {
    submitBtn.disabled = false;
  }
});

downloadResumeBtn.addEventListener("click", () => {
  if (!generated) return;
  downloadBase64Pdf(generated.resumePdfBase64, generated.resumeFileName);
});

downloadCoverBtn.addEventListener("click", () => {
  if (!generated) return;
  downloadBase64Pdf(generated.coverLetterPdfBase64, generated.coverLetterFileName);
});
