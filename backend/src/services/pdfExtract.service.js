const axios = require("axios");
const pdfParse = require("pdf-parse");

exports.extractTextFromPdf = async (pdfUrl) => {
  try {
    console.log("🔍 Extracting PDF from:", pdfUrl);

    const response = await axios.get(pdfUrl, {
      responseType: "arraybuffer",
      headers: {
        Accept: "application/pdf",
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    const contentType = response.headers["content-type"];
    if (!contentType?.includes("pdf")) {
      console.error("❌ Not a PDF. Content-Type:", contentType);
      throw new Error("Invalid PDF file");
    }

    const pdfData = await pdfParse(response.data);

    return pdfData.text.replace(/\s+/g, " ").trim();
  } catch (error) {
    console.error("❌ PDF extraction failed:", error.message);
    throw new Error("Failed to extract PDF text");
  }
};
