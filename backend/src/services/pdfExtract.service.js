const axios = require("axios");
const pdfParse = require("pdf-parse");

exports.extractTextFromPdf = async (pdfUrl) => {
  try {

    const response = await axios.get(pdfUrl, {
      responseType: "arraybuffer",
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    const contentType = response.headers["content-type"] || "";
    if (!contentType.includes("pdf")) {
      throw new Error(`Not a PDF. Content-Type: ${contentType}`);
    }

    const parsed = await pdfParse(response.data);

    return parsed.text
      .replace(/\s+/g, " ")
      .trim();

  } catch (err) {
    console.error("❌ PDF extraction failed:", err.message);
    throw new Error("Failed to extract PDF text");
  }
};
