const { getGeminiClient } = require("../lib/geminiClient");
const { chunkText } = require("../utils/textChunker");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const SAMPLE_EXTRACTION = {
  docNo: "SAMPLE-DOC",
  executionDate: "2024-01-01",
  registrationDate: "2024-01-01",
  nature: "Sale Deed (Sample)",
  considerationValue: "₹10,00,000",
  marketValue: "₹12,00,000",
  surveyNumbers: ["329/1", "330"],
  plotNumber: "79",
  extent: "130 sq.m",
  note: "Sample data due to AI quota or parsing issue",
};

exports.extractStructuredData = async (rawText) => {
  if (!rawText || rawText.length < 50) {
    throw new Error("Text too short for extraction");
  }

  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  const chunks = chunkText(rawText, 3000);
  let retryDelay = 20000;

  for (let i = 0; i < chunks.length; i++) {
    console.log(`📦 Extracting data from chunk ${i + 1}/${chunks.length}`);

    const prompt = `
You are a legal document data extraction engine.

Rules:
- Input text may be Tamil, English, or mixed.
- Understand the text first, then extract fields.
- Return STRICT VALID JSON.
- Do NOT add explanations or markdown.

Required JSON format:
{
  "docNo": "",
  "executionDate": "",
  "registrationDate": "",
  "nature": "",
  "considerationValue": "",
  "marketValue": "",
  "surveyNumbers": [],
  "plotNumber": "",
  "extent": ""
}

Text:
${chunks[i]}
`;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();

      // Sanitize JSON
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("Invalid JSON response");
      }

      const cleanJson = text.slice(jsonStart, jsonEnd + 1);
      return JSON.parse(cleanJson);

    } catch (err) {
      console.error("❌ Extraction error:", err.message);

      if (
        err.message.includes("429") ||
        err.message.includes("Quota") ||
        err.message.includes("rate")
      ) {
        console.log(`⏳ Rate limit hit. Waiting ${retryDelay / 1000}s`);
        await sleep(retryDelay);
        retryDelay *= 2;
        i--; // retry same chunk
        continue;
      }

      throw err;
    }
  }

  // fallback safety
  return SAMPLE_EXTRACTION;
};
