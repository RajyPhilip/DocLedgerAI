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
const { eq, and, desc } = require("drizzle-orm");
const db = require("../db");
const { documentTexts } = require("../db/schema/document_texts.schema");

const SAMPLE_SUMMARY = `
This document appears to be a legal real estate related agreement.
It contains details about ownership, registration, and monetary value.
(This is sample summary due to AI quota limitations.)
`;

const SAMPLE_EXTRACTION = {
  buyer: "Sample Buyer",
  seller: "Sample Seller",
  house_no: "123",
  survey_no: "45A",
  document_no: "DOC-XXXX",
  date: "2024-01-01",
  value: "₹10,00,000",
  note: "Sample data due to AI quota limit"
};

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

exports.processSummary = async (documentId) => {
  const [docText] = await db
    .select()
    .from(documentTexts)
    .where(
      and(
        eq(documentTexts.documentId, documentId),
        eq(documentTexts.type, "original")
      )
    )
    .orderBy(desc(documentTexts.createdAt))
    .limit(1);

  // ✅ DO NOT THROW — FALL BACK
  if (!docText?.content) {
    console.error("⚠️ Extracted text not found, saving sample summary");

    await db.insert(documentAIOutputs).values({
      documentId,
      summaryText: SAMPLE_SUMMARY,
      isSample: true,
    });

    return;
  }

  try {
    const summary = await generateSummary(docText.content);

    await db.insert(documentAIOutputs).values({
      documentId,
      summaryText: summary,
      isSample: false,
    });

  } catch (err) {
    console.error("❌ Gemini summary failed, saving sample");

    await db.insert(documentAIOutputs).values({
      documentId,
      summaryText: SAMPLE_SUMMARY,
      isSample: true,
    });
  }
};

exports.processExtraction = async (documentId) => {
  const [docText] = await db
    .select()
    .from(documentTexts)
    .where(
      and(
        eq(documentTexts.documentId, documentId),
        eq(documentTexts.type, "original")
      )
    )
    .orderBy(desc(documentTexts.createdAt))
    .limit(1);

  if (!docText?.content) {
    console.error("⚠️ Extracted text not found, saving sample extraction");

    await db.insert(documentTransactions).values({
      documentId,
      extractedJson: SAMPLE_EXTRACTION,
      isSample: true,
    });

    return;
  }

  try {
    const extractedJson = await extractStructuredData(docText.content);

    await db.insert(documentTransactions).values({
      documentId,
      extractedJson,
      isSample: false,
    });

  } catch (err) {
    console.error("❌ Gemini extraction failed, saving sample");

    await db.insert(documentTransactions).values({
      documentId,
      extractedJson: SAMPLE_EXTRACTION,
      isSample: true,
    });
  }
};
