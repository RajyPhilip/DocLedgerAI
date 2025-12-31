const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadPDF = (buffer, fileName) => {
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







