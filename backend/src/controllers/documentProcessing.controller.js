const { extractTextFromPdf } = require("../services/pdfExtract.service");
const { translateText } = require("../services/translation.service");
const { generateTranslatedPDF } = require("../services/pdf.service");
const { generateSummary } = require("../services/summarization.service");
const { extractStructuredData } = require("../services/aiExtraction.service");

const { documentAIOutputs } = require("../db/schema/document_ai_outputs.schema");
const { documentTransactions } = require("../db/schema/document_transactions.schema");
const { documents } = require("../db/schema/documents.schema");

const { uploadPDF } = require("../services/cloudinary.service");
const { eq } = require("drizzle-orm");
const db = require("../db");

/* ================= TRANSLATION ================= */

exports.processTranslation = async (documentId, fileUrl) => {
  const extractedText = await extractTextFromPdf(fileUrl);
  const translatedText = await translateText(extractedText);

  const translatedPdfBuffer = await generateTranslatedPDF(translatedText);

  const translatedPdfUrl = await uploadPDF(
    translatedPdfBuffer,
    `translated_${documentId}.pdf`
  );

  await db
    .update(documents)
    .set({
      translatedFileUrl: translatedPdfUrl,
      status: "TRANSLATED",
    })
    .where(eq(documents.id, documentId));
};

exports.processSummary = async (documentId, fileUrl, source) => {
  const text = await extractTextFromPdf(fileUrl);
  const summary = await generateSummary(text);

  await db.insert(documentAIOutputs).values({
    documentId,
    summary_text,
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