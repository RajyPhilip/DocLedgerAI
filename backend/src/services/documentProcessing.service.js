const { extractTextFromPDF } = require("./pdfExtract.service");
const { translateTamilToEnglish } = require("./translation.service");
const { generateSummary } = require("./summarization.service");
const { extractStructuredData } = require("./aiExtraction.service");

const db = require("../db");
const { documentTexts } = require("../db/schema/document_texts.schema");
const { documentAIOutputs } = require("../db/schema/document_ai_outputs.schema");

async function processDocument(documentId, fileUrl) {
  console.log("🧠 AI processing started for doc:", documentId);

  // 1️⃣ Extract text
  const tamilText = await extractTextFromPDF(fileUrl);

  // 2️⃣ Translate
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

  // 6️⃣ Save AI output
  await db.insert(documentAIOutputs).values({
    documentId,
    summary,
    extractedJson: structuredData,
  });

  console.log("✅ AI processing completed for doc:", documentId);
}

module.exports = { processDocument };
