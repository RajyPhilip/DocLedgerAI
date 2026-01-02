const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadPdf = (buffer, fileName) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "raw", // ✅ PDFs must be raw
          folder: "docledger_documents",
          public_id: fileName.replace(/\.pdf$/i, ""),
          format: "pdf",
          use_filename: true,
          unique_filename: false,
        },
        (error, result) => {
          if (error) return reject(error);

          resolve(result.secure_url);
        }
      )
      .end(buffer);
  });
};

exports.deletePdf = async (fileUrl) => {
  if (!fileUrl) return;

  try {
    console.log("🗑️ Deleting Cloudinary file:", fileUrl);

    // Extract path AFTER /upload/
    const uploadIndex = fileUrl.indexOf("/upload/");
    let publicPath = fileUrl.substring(uploadIndex + 8);

    // Remove version if exists (v12345/)
    if (publicPath.startsWith("v")) {
      publicPath = publicPath.substring(publicPath.indexOf("/") + 1);
    }

    // Remove extension (.pdf)
    const publicId = publicPath.replace(".pdf", "");

    console.log("🧹 Public ID:", publicId);

    await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw", // ✅ MUST MATCH upload
      invalidate: true,
    });

    console.log("✅ Cloudinary delete successful");
  } catch (err) {
    console.error("❌ Cloudinary delete failed:", err.message);
  }
};





