const { documents } = require("../db/schema/documents.schema");
const {  eq, ilike, and, desc, sql } = require("drizzle-orm");
const { uploadPDF } = require("../services/cloudinary.service");
const { processDocument } = require("../services/documentProcessing.service");
const db = require("../db");

const PAGE_SIZE = 10;

exports.uploadDocument = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "File is required" });
    }

    const file = req.files[0];
    const originalFilename = Array.isArray(req.body.displayNames)
      ? req.body.displayNames[0]
      : file.originalname;

    // 1️⃣ Upload PDF
    const fileUrl = await uploadPDF(file.buffer, originalFilename);

    // 2️⃣ Save document
    const [doc] = await db
      .insert(documents)
      .values({
        userId,
        originalFilename,
        fileUrl,
        status: "UPLOADED",
      })
      .returning();

    // 3️⃣ Fire-and-forget AI processing (SAFE)
    process.nextTick(() => {
      processDocument(doc.id, doc.fileUrl)
        .catch(err => console.error("AI processing failed:", err));
    });

    return res.status(201).json({
      status: "success",
      data: doc,
    });
  } catch (err) {
    console.error("Upload failed:", err);
    return res.status(500).json({ message: "Upload failed" });
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

exports.deleteDocument = async (req, res) => {
  const userId = req.user.id;
  const docId = Number(req.params.id);

  await db
    .delete(documents)
    .where(eq(documents.id, docId));

  res.json({ status: "success" });
};
