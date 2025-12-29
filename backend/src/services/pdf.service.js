const pdfParse = require("pdf-parse");
const axios = require("axios");

exports.extractTextFromPdfUrl = async (pdfUrl) => {
  // 1️ Download PDF as buffer
  const response = await axios.get(pdfUrl, {
    responseType: "arraybuffer",
  });

  const pdfBuffer = Buffer.from(response.data);

  // 2️ Extract text
  const parsed = await pdfParse(pdfBuffer);

  return parsed.text?.trim() || "";
};
