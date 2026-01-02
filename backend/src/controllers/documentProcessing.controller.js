const { extractTextFromPdf } = require("../services/pdfExtract.service");
const { translateTamilToEnglish  } = require("../services/translation.service");
const { generateTranslatedPdf } = require("../services/pdf.service");
const { generateSummary } = require("../services/summarization.service");
const { extractStructuredData } = require("../services/aiExtraction.service");
const { documentAIOutputs } = require("../db/schema/document_ai_outputs.schema");
const { documentTransactions } = require("../db/schema/document_transactions.schema");
const { documents } = require("../db/schema/documents.schema");
const { chunkText } = require("../utils/textChunker");
const { uploadPdf } = require("../services/cloudinary.service");
const { eq, and, desc } = require("drizzle-orm");
const db = require("../db");
const { documentTexts } = require("../db/schema/document_texts.schema");
const { DOCUMENT_STATUSES, TRANSLATION_TIMEOUT_MS } = require("../constants/documents.data");

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

exports.processTranslation = async (documentId, fileUrl) => {

  // Mark as translating
  await db.update(documents)
    .set({ translationStatus: DOCUMENT_STATUSES.TRANSLATING })
    .where(eq(documents.id, documentId));

  let completed = false;

  // Watchdog timer
  const timeoutId = setTimeout(async () => {
    if (completed) return;

    console.error("⏰ Translation timeout:", documentId);

    await db.update(documents)
      .set({ translationStatus: DOCUMENT_STATUSES.TRANSLATION_FAILED })
      .where(
        and(
          eq(documents.id, documentId),
          eq(documents.translationStatus, DOCUMENT_STATUSES.TRANSLATING)
        )
      );
  }, TRANSLATION_TIMEOUT_MS);

  try {
    // Actual translation work
    const extractedText = await extractTextFromPdf(fileUrl);
    const chunks = chunkText(extractedText);
    const translatedText = await translateTamilToEnglish(chunks);

    const translatedPdfBuffer = await generateTranslatedPdf(translatedText);
    const translatedPdfUrl = await uploadPdf(
      translatedPdfBuffer,
      `translated_${documentId}.pdf`
    );

    completed = true;
    clearTimeout(timeoutId);

    // Mark success (ONLY if still translating)
    await db.update(documents)
      .set({
        translatedFileUrl: translatedPdfUrl,
        translationStatus: DOCUMENT_STATUSES.TRANSLATED,
        status: "TRANSLATED",
      })
      .where(
        and(
          eq(documents.id, documentId),
          eq(documents.translationStatus, DOCUMENT_STATUSES.TRANSLATING)
        )
      );

  } catch (err) {
    completed = true;
    clearTimeout(timeoutId);

    console.error(" Translation failed:", err.message);

    await db.update(documents)
      .set({ translationStatus: DOCUMENT_STATUSES.TRANSLATION_FAILED })
      .where(eq(documents.id, documentId));
  }
};

exports.processSummary = async (documentId) => {

  await db.update(documents)
    .set({ summaryStatus: DOCUMENT_STATUSES.SUMMARIZING })
    .where(eq(documents.id, documentId));

  let completed = false;

  const timeoutId = setTimeout(async () => {
    if (completed) return;

    console.error(" Summary timeout:", documentId);

    await db.update(documents)
      .set({ summaryStatus: DOCUMENT_STATUSES.SUMMARY_FAILED })
      .where(
        and(
          eq(documents.id, documentId),
          eq(documents.summaryStatus, DOCUMENT_STATUSES.SUMMARIZING)
        )
      );
  }, TRANSLATION_TIMEOUT_MS);

  try {
    const [docText] = await db
      .select()
      .from(documentTexts)
      .where(eq(documentTexts.documentId, documentId))
      .orderBy(desc(documentTexts.createdAt))
      .limit(1);

    if (!docText?.content) {
      console.warn("No extracted text, saving sample summary");

      completed = true;
      clearTimeout(timeoutId);

      await db.insert(documentAIOutputs).values({
        documentId,
        summaryText: SAMPLE_SUMMARY,
        isSample: true,
      });

      await db.update(documents)
        .set({ summaryStatus: DOCUMENT_STATUSES.SUMMARY_SAMPLE })
        .where(eq(documents.id, documentId));

      return;
    }

    const summary = await generateSummary(docText.content);

    completed = true;
    clearTimeout(timeoutId);

    await db.insert(documentAIOutputs).values({
      documentId,
      summaryText: summary,
      isSample: false,
    });

    await db.update(documents)
      .set({ summaryStatus: DOCUMENT_STATUSES.SUMMARY_COMPLETED })
      .where(
        and(
          eq(documents.id, documentId),
          eq(documents.summaryStatus, DOCUMENT_STATUSES.SUMMARIZING)
        )
      );


  } catch (err) {
    completed = true;
    clearTimeout(timeoutId);

    console.error("Summary failed:", err.message);

    await db.insert(documentAIOutputs).values({
      documentId,
      summaryText: SAMPLE_SUMMARY,
      isSample: true,
    });

    await db.update(documents)
      .set({ summaryStatus: DOCUMENT_STATUSES.SUMMARY_SAMPLE })
      .where(eq(documents.id, documentId));
  }
};

exports.processExtraction = async (documentId) => {

  await db.update(documents)
    .set({ extractionStatus: DOCUMENT_STATUSES.EXTRACTING })
    .where(eq(documents.id, documentId));

  let completed = false;

  const timeoutId = setTimeout(async () => {
    if (completed) return;

    console.error(" Extraction timeout:", documentId);

    await db.update(documents)
      .set({ extractionStatus: DOCUMENT_STATUSES.EXTRACTION_FAILED })
      .where(
        and(
          eq(documents.id, documentId),
          eq(documents.extractionStatus, DOCUMENT_STATUSES.EXTRACTING)
        )
      );
  }, TRANSLATION_TIMEOUT_MS);

  try {
    const [docText] = await db
      .select()
      .from(documentTexts)
      .where(eq(documentTexts.documentId, documentId))
      .orderBy(desc(documentTexts.createdAt))
      .limit(1);

    if (!docText?.content) {
      console.warn("No extracted text, saving sample extraction");

      completed = true;
      clearTimeout(timeoutId);

      await db.insert(documentTransactions).values({
        documentId,
        extractedJson: SAMPLE_EXTRACTION,
        isSample: true,
      });

      await db.update(documents)
        .set({ extractionStatus: DOCUMENT_STATUSES.EXTRACTION_SAMPLE })
        .where(eq(documents.id, documentId));

      return;
    }

    const extractedJson = await extractStructuredData(docText.content);

    completed = true;
    clearTimeout(timeoutId);

    await db.insert(documentTransactions).values({
      documentId,
      extractedJson,
      isSample: false,
    });

    await db.update(documents)
      .set({ extractionStatus: DOCUMENT_STATUSES.EXTRACTION_COMPLETED })
      .where(
        and(
          eq(documents.id, documentId),
          eq(documents.extractionStatus, DOCUMENT_STATUSES.EXTRACTING)
        )
      );


  } catch (err) {
    completed = true;
    clearTimeout(timeoutId);

    console.error("Extraction failed:", err.message);

    await db.insert(documentTransactions).values({
      documentId,
      extractedJson: SAMPLE_EXTRACTION,
      isSample: true,
    });

    await db.update(documents)
      .set({ extractionStatus: DOCUMENT_STATUSES.EXTRACTION_SAMPLE })
      .where(eq(documents.id, documentId));
  }
};