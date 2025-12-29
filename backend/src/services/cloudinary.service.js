const cloudinary = require("cloudinary").v2;
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadPDF = async (file) => {
  if (!file || !file.buffer) {
    throw new Error("Invalid file");
  }

  const filename = file.originalname || `document_${Date.now()}.pdf`;
  const publicId = `doc_${Date.now()}_${path.parse(filename).name}`;

  // 🔑 IMPORTANT FIX: convert ArrayBuffer → Buffer
  const buffer =
    Buffer.isBuffer(file.buffer)
      ? file.buffer
      : Buffer.from(file.buffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "docledger_documents",
          resource_type: "raw",
          public_id: publicId,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      )
      .end(buffer); // ✅ always Buffer now
  });
};

const deletePDF = async (publicId) => {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: "raw",
  });
};

module.exports = { uploadPDF, deletePDF };
