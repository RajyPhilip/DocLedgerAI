const { documents } = require("../db/schema/documents.schema");
const {  eq, ilike, and, desc, sql } = require("drizzle-orm");
const { uploadPDF } = require("../services/cloudinary.service");
// const { processDocument } = require("../documentProcessing.controller");
const { processTranslation, processSummary, processExtraction } = require("./documentProcessing.controller");
const { documentAIOutputs } = require("../db/schema/document_ai_outputs.schema");
const { documentTransactions } = require("../db/schema/document_transactions.schema");

const db = require("../db");
const { extractTextFromPdf } = require("../services/pdfExtract.service");

const PAGE_SIZE = 10;

exports.uploadDocument = async (req, res) => {
  try {
    const userId = req.user.userId;
    const file = req.file;

    const fileName = req.body.displayName || file.originalname;
    const fileUrl = await uploadPDF(file.buffer, fileName);

    const [doc] = await db.insert(documents).values({
      userId,
      originalFilename: fileName,
      fileUrl,
      status: "UPLOADED",
    }).returning();

    // 🔥 Extract text ONCE and SAVE PROPERLY
    process.nextTick(async () => {
      try {
        const extractedText = await extractTextFromPdf(fileUrl);

        await db.insert(documentTexts).values({
          documentId: doc.id,
          content: extractedText,     // ✅ FIX
          language: "original",
          type: "original",
        });

        console.log("✅ Extracted text saved for doc", doc.id);
        console.log("✅ Extracted TEXXTT", extractedText);

      } catch (err) {
        console.error("❌ Text extraction failed:", err.message);
      }
    });

    res.status(201).json({ status: "success", data: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
};


exports.getDocuments = async (req, res) => {
  try {
    const userId = req.user.userId;

    const pageNumber = Number(req.query.pageNumber) || 1;

    // 🔥 FIX: READ `search`, NOT `searchQuery`
    const search = req.query.search?.trim() || "";

    const offset = (pageNumber - 1) * PAGE_SIZE;

    /* ================= WHERE CONDITION ================= */

    let whereCondition = eq(documents.userId, userId);

    if (search) {
      whereCondition = and(
        eq(documents.userId, userId),
        ilike(documents.originalFilename, `%${search}%`)
      );
    }

    /* ================= FETCH DATA ================= */

    const data = await db
      .select({
        id: documents.id,
        name: documents.originalFilename,
        url: documents.fileUrl,
        createdAt: documents.createdAt,
      })
      .from(documents)
      .where(whereCondition)
      .orderBy(desc(documents.createdAt))
      .limit(PAGE_SIZE)
      .offset(offset);

    /* ================= COUNT FILTERED ROWS ================= */

    const [{ count }] = await db
      .select({ count: sql`count(*)::int` })
      .from(documents)
      .where(whereCondition);

    return res.json({
      status: "success",
      data, // ✅ empty array if no match
      totalPages: count === 0 ? 1 : Math.ceil(count / PAGE_SIZE),
    });
  } catch (error) {
    console.error("Get documents failed:", error);
    return res.status(500).json({
      message: "Failed to fetch documents",
    });
  }
};

exports.updateDocumentName = async (req, res) => {
  try {
    const userId = req.user.userId;
    const documentId = Number(req.params.id);
    const { fileName } = req.body;

    /* ================= VALIDATIONS ================= */

    if (!documentId || isNaN(documentId)) {
      return res.status(400).json({ message: "Invalid document id" });
    }


    const [existingDoc] = await db
      .select()
      .from(documents)
      .where(
        and(
          eq(documents.id, documentId),
          eq(documents.userId, userId)
        )
      );

    if (!existingDoc) {
      return res.status(404).json({
        message: "Document not found or access denied",
      });
    }

    const [updatedDoc] = await db
      .update(documents)
      .set({
        originalFilename: fileName,
      })
      .where(eq(documents.id, documentId))
      .returning({
        id: documents.id,
        name: documents.originalFilename,
        fileUrl: documents.fileUrl,
        createdAt: documents.createdAt,
      });

    return res.json({
      status: "success",
      message: "Document name updated successfully",
    });
  } catch (err) {
    console.error("Update document failed:", err);
    return res.status(500).json({
      message: "Failed to update document name",
    });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const userId = req.user.userId;
    const docId = Number(req.params.id);

    const result = await db
      .delete(documents)
      .where(
        and(
          eq(documents.id, docId),
          eq(documents.userId, userId)
        )
      )
      .returning();

    if (result.length === 0) {
      return res.status(404).json({
        message: "Document not found or access denied",
      });
    }

    res.json({ status: "success" });
  } catch (err) {
    console.error("Delete document failed:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};

exports.getDocumentDetail = async (req, res) => {
  try {
    const documentId = Number(req.params.id);

    if (!documentId || isNaN(documentId)) {
      return res.status(400).json({ message: "Invalid document id" });
    }

    const [doc] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, documentId));

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

      const [summary] = await db
        .select()
        .from(documentAIOutputs)
        .where(eq(documentAIOutputs.documentId, documentId))
        .orderBy(desc(documentAIOutputs.createdAt))
        .limit(1);

    const [extracted] = await db
      .select()
      .from(documentTransactions)
      .where(eq(documentTransactions.documentId, documentId))
      .orderBy(desc(documentTransactions.createdAt))
      .limit(1);

    return res.json({
      status: "success",
      data: {
        ...doc,

        summary: summary?.summaryText || null,

        extractedJson: extracted?.extractedJson ?? null,
        extractedSource: extracted?.source ?? null,
        summaryIsSample: summary?.isSample ?? false,
        extractedIsSample: extracted?.isSample ?? false,
      },
    });
  } catch (err) {
    console.error("Get document detail failed:", err);
    return res.status(500).json({
      message: "Failed to fetch document detail",
    });
  }
};

exports.translateDocument = async (req, res) => {
  const documentId = Number(req.params.id);

  const [doc] = await db
    .select()
    .from(documents)
    .where(eq(documents.id, documentId));

  if (!doc) {
    return res.status(404).json({ message: "Document not found" });
  }

  if (doc.translatedFileUrl) {
    return res.json({
      status: "success",
      translatedFileUrl: doc.translatedFileUrl,
    });
  }

  process.nextTick(() =>
    processTranslation(documentId, doc.fileUrl).catch(console.error)
  );

  res.json({
    status: "success",
    message: "Translation started",
  });
};

exports.generateSummary = async (req, res) => {
  try {
    const documentId = Number(req.params.id);

    const [doc] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, documentId));

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    const source = doc.translatedFileUrl ? "translated" : "original";
    const fileUrl = doc.translatedFileUrl || doc.fileUrl;

    process.nextTick(() => {
      processSummary(documentId, fileUrl, source)
        .catch(err =>
          console.error(`Summary failed for document ${documentId}`, err)
        );
    });

    res.json({
      status: "success",
      message: "Summary generation started",
    });
  } catch (err) {
    res.status(500).json({ message: "Summary failed" });
  }
};

exports.extractData = async (req, res) => {
  try {
    const documentId = Number(req.params.id);

    const [doc] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, documentId));

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    const source = doc.translatedFileUrl ? "translated" : "original";
    const fileUrl = doc.translatedFileUrl || doc.fileUrl;

    process.nextTick(() => {
      processExtraction(documentId, fileUrl, source)
        .catch(err =>
          console.error(`Extraction failed for document ${documentId}`, err)
        );
    });

    res.json({
      status: "success",
      message: "Extraction started",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Extraction failed" });
  }
};
