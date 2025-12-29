const axios = require("axios");
const pdfParse = require("pdf-parse");

/**
 * Extract raw text from a PDF URL
 */
exports.extractTextFromPDF = async (pdfUrl) => {
  try {
    // 1️⃣ Download PDF
    const response = await axios.get(pdfUrl, {
      responseType: "arraybuffer",
    });

    // 2️⃣ Parse PDF
    const pdfData = await pdfParse(response.data);

    // 3️⃣ Clean text
    const text = pdfData.text
      .replace(/\s+/g, " ")
      .trim();

    return text;
  } catch (error) {
    console.error("PDF extraction failed:", error);
    throw new Error("Failed to extract PDF text");
  }
};
