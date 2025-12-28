const db = require("../db");
const { pdfUploads } = require("../db/schema/pdfUploads.schema");
const { uploadPdf, deletePdf } = require("../services/cloudinary.service");
const { eq, desc } = require("drizzle-orm");

// UPLOAD DOCUMENT
exports.uploadDocument = async (req, res) => {
  try {
    const userId = req.user.userId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        status: "error",
        message: "No file uploaded",
      });
    }

    const cloudinaryRes = await uploadPdf(
      file.buffer,
      file.originalname
    );

    const [doc] = await db
      .insert(pdfUploads)
      .values({
        userId,
        fileName: file.originalname,
        storageKey: cloudinaryRes.public_id,
        fileUrl: cloudinaryRes.secure_url,
        mimeType: file.mimetype,
      })
      .returning();

    return res.status(201).json({
      status: "success",
      data: doc,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({
      status: "error",
      message: "Upload failed",
    });
  }
};

// GET DOCUMENTS (PAGINATION)
exports.getDocuments = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const offset = (page - 1) * limit;

    const docs = await db
      .select()
      .from(pdfUploads)
      .where(eq(pdfUploads.userId, userId))
      .orderBy(desc(pdfUploads.createdAt))
      .limit(limit)
      .offset(offset);

    return res.json({
      status: "success",
      data: {
        page,
        limit,
        documents: docs,
        hasNextPage: docs.length === limit,
      },
    });
  } catch (err) {
    console.error("Fetch documents error:", err);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch documents",
    });
  }
};

// DELETE DOCUMENT
exports.deleteDocument = async (req, res) => {
  try {
    const userId = req.user.userId;
    const docId = Number(req.params.id);

    const [doc] = await db
      .select()
      .from(pdfUploads)
      .where(eq(pdfUploads.id, docId));

    if (!doc) {
      return res.status(404).json({
        status: "error",
        message: "Document not found",
      });
    }

    // Ownership check
    if (doc.userId !== userId) {
      return res.status(403).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    await deletePdf(doc.storageKey);
    await db.delete(pdfUploads).where(eq(pdfUploads.id, docId));

    return res.json({
      status: "success",
      message: "Document deleted",
    });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({
      status: "error",
      message: "Delete failed",
    });
  }
};
