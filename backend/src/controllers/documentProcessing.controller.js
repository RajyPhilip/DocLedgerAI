const { extractTextFromPdf } = require("../services/pdfExtract.service");
const { translateTamilToEnglish  } = require("../services/translation.service");
const { generateTranslatedPdf } = require("../services/pdf.service");
const { generateSummary } = require("../services/summarization.service");
const { extractStructuredData } = require("../services/aiExtraction.service");
const { documentAIOutputs } = require("../db/schema/document_ai_outputs.schema");
const { documentTransactions } = require("../db/schema/document_transactions.schema");
const { documents } = require("../db/schema/documents.schema");
const { chunkText } = require("../utils/textChunker");
const { uploadPDF } = require("../services/cloudinary.service");
const { eq } = require("drizzle-orm");
const db = require("../db");

/* ================= TRANSLATION ================= */

exports.processTranslation = async (documentId, fileUrl) => {
  console.log("🚀 Translation started for doc:", documentId);

  // 1️⃣ Extract text (NO AI)
  const extractedText = await extractTextFromPdf(fileUrl);

  // 2️⃣ Chunk text
  const chunks = chunkText(extractedText);

  // 3️⃣ Translate chunks (LOW TOKEN)
  const translatedText = await translateTamilToEnglish(chunks);

  // 4️⃣ Generate PDF
  const translatedPdfBuffer = await generateTranslatedPdf(translatedText);

  // 5️⃣ Upload PDF
  const translatedPdfUrl = await uploadPDF(
    translatedPdfBuffer,
    `translated_${documentId}.pdf`
  );

  // 6️⃣ Save URL
  await db
    .update(documents)
    .set({
      translatedFileUrl: translatedPdfUrl,
      status: "TRANSLATED",
    })
    .where(eq(documents.id, documentId));

  console.log("✅ Translation completed:", translatedPdfUrl);
};

exports.processSummary = async (documentId, fileUrl, source) => {
  const text = await extractTextFromPdf(fileUrl);
  const summary = await generateSummary(text);

  await db.insert(documentAIOutputs).values({
    documentId,
    summary_text:summary,
  });
};

exports.processExtraction = async (documentId, fileUrl, source) => {
  const text = await extractTextFromPdf(fileUrl);
  const extractedJson = await extractStructuredData(text);

  await db.insert(documentTransactions).values({
    documentId,
    extractedJson,
    source,
  });
};

