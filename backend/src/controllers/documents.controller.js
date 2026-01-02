const { documents } = require("../db/schema/documents.schema");
const {  eq, ilike, and, desc, sql } = require("drizzle-orm");
const { uploadPdf, deletePdf } = require("../services/cloudinary.service");
// const { processDocument } = require("../documentProcessing.controller");
const { processTranslation, processSummary, processExtraction } = require("./documentProcessing.controller");
const { documentAIOutputs } = require("../db/schema/document_ai_outputs.schema");
const { documentTransactions } = require("../db/schema/document_transactions.schema");

const db = require("../db");
const { extractTextFromPdf } = require("../services/pdfExtract.service");
const { documentTexts } = require("../db/schema/document_texts.schema");

const PAGE_SIZE = 10;

exports.uploadDocument = async (req, res) => {
  try {
    const userId = req.user.userId;
    const file = req.file;

    const fileName = req.body.displayName || file.originalname;
    const fileUrl = await uploadPdf(file.buffer, fileName);

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
    const documentId = Number(req.params.id);

    if (!documentId || isNaN(documentId)) {
      return res.status(400).json({ message: "Invalid document id" });
    }

    const [doc] = await db
      .select()
      .from(documents)
      .where(
        and(
          eq(documents.id, documentId),
          eq(documents.userId, userId)
        )
      );

    if (!doc) {
      return res.status(404).json({
        message: "Document not found or access denied",
      });
    }

    // 2️⃣ Delete from Cloudinary
    try {
      await deletePdf(doc.fileUrl);
      if (doc.translatedFileUrl) {
        await deletePdf(doc.translatedFileUrl);
      }
    } catch (err) {
      console.error("⚠️ Cloudinary delete failed:", err.message);
    }

    // 3️⃣ Delete related DB rows (ORDER MATTERS)
    await db.delete(documentTexts)
      .where(eq(documentTexts.documentId, documentId));

    await db.delete(documentAIOutputs)
      .where(eq(documentAIOutputs.documentId, documentId));

    await db.delete(documentTransactions)
      .where(eq(documentTransactions.documentId, documentId));

    // 4️⃣ Delete document itself
    await db.delete(documents)
      .where(eq(documents.id, documentId));

    return res.json({
      status: "success",
      message: "Document deleted successfully",
    });

  } catch (err) {
    console.error("Delete document failed:", err);
    return res.status(500).json({ message: "Delete failed" });
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
        id: doc.id,
        originalFilename: doc.originalFilename,
        fileUrl: doc.fileUrl,
        translatedFileUrl: doc.translatedFileUrl,
        createdAt: doc.createdAt,
        translationStatus: doc.translationStatus || DOCUMENT_STATUSES.IDLE,
        summaryStatus: doc.summaryStatus || DOCUMENT_STATUSES.IDLE,
        extractionStatus: doc.extractionStatus || DOCUMENT_STATUSES.IDLE,
        summary: summary?.summaryText || null,
        summaryIsSample: summary?.isSample ?? false,
        extractedJson: extracted?.extractedJson ?? null,
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

    process.nextTick(() => {
      processSummary(documentId).catch(err =>
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

    process.nextTick(() => {
      processExtraction(documentId).catch(err =>
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