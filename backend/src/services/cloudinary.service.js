const cloudinary = require("cloudinary").v2;
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadPdf = async (buffer, filename) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "docledger_documents",
          resource_type: "raw",
          public_id: `doc_${Date.now()}_${path.parse(filename).name}`,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
      .end(buffer);
  });
};

const deletePdf = async (publicId) => {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: "raw",
  });
};

module.exports = { uploadPdf, deletePdf };
