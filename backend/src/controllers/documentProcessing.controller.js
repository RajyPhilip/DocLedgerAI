const { extractTextFromPDF } = require("../services/pdfExtract.service");
const { translateTamilToEnglish } = require("../services/translation.service");
const { generateSummary } = require("../services/summarization.service");
const { extractStructuredData } = require("../services/aiExtraction.service");

const db = require("../db");
const { documents } = require("../db/schema/documents.schema");
const { documentTexts } = require("../db/schema/document_texts.schema");
const { documentAIOutputs } = require("../db/schema/document_ai_outputs.schema");

/**
 * INTERNAL SERVICE (not an express handler)
 */
async function processDocument(documentId, fileUrl) {
  // 1️⃣ Extract Tamil text
  const tamilText = await extractTextFromPDF(fileUrl);

  // 2️⃣ Translate to English
  const englishText = await translateTamilToEnglish(tamilText);

  // 3️⃣ Save texts
  await db.insert(documentTexts).values({
    documentId,
    originalText: tamilText,
    translatedText: englishText,
  });

  // 4️⃣ Summary
  const summary = await generateSummary(englishText);

  // 5️⃣ Structured JSON
  const structuredData = await extractStructuredData(englishText);

  // 6️⃣ Save AI outputs
  await db.insert(documentAIOutputs).values({
    documentId,
    summary,
    extractedJson: structuredData,
  });
}

/**
 * ================= EXPRESS CONTROLLERS =================
 */

exports.extractDocumentText = async (req, res) => {
  try {
    const documentId = Number(req.params.id);

    const [doc] = await db
      .select()
      .from(documents)
      .where(documents.id.eq(documentId));

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    await processDocument(documentId, doc.fileUrl);

    res.json({ status: "success", message: "Text extracted & stored" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Extraction failed" });
  }
};

exports.translateDocument = async (req, res) => {
  try {
    const documentId = Number(req.params.id);

    const [text] = await db
      .select()
      .from(documentTexts)
      .where(documentTexts.documentId.eq(documentId));

    if (!text) {
      return res.status(404).json({ message: "No extracted text found" });
    }

    res.json({
      status: "success",
      translatedText: text.translatedText,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Translation failed" });
  }
};

exports.summarizeDocument = async (req, res) => {
  try {
    const documentId = Number(req.params.id);

    const [ai] = await db
      .select()
      .from(documentAIOutputs)
      .where(documentAIOutputs.documentId.eq(documentId));

    if (!ai) {
      return res.status(404).json({ message: "No summary found" });
    }

    res.json({
      status: "success",
      summary: ai.summary,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Summary failed" });
  }
};
