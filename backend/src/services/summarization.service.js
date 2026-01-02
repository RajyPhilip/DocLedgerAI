const { getGeminiClient } = require("../lib/geminiClient");
const { chunkText } = require("../utils/textChunker");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

exports.generateSummary = async (rawText) => {
  if (!rawText || rawText.length < 50) {
    throw new Error("Text too short to summarize");
  }

  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  // 🔹 Chunk to avoid token overflow
  const chunks = chunkText(rawText, 3500);

  let finalSummary = "";
  let retryDelay = 20000;

  for (let i = 0; i < chunks.length; i++) {
    console.log(`Summarizing chunk ${i + 1}/${chunks.length}`);

    const prompt = `
You are a legal document summarization expert.

Instructions:
- The input text may be Tamil, English, or mixed.
- FIRST understand the content in its original language.
- THEN produce a clear, professional English summary.
- Use bullet points.
- Do NOT add assumptions.

Text:
${chunks[i]}
`;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      finalSummary += "\n" + text;

      // small delay to stay under RPM
      if (i < chunks.length - 1) {
        await sleep(4000);
      }

      retryDelay = 20000; // reset after success
    } catch (err) {
      console.error("Gemini summarization error:", err.message);

      // Only retry / fallback on quota exceed
      if (
        err.message.includes("429") ||
        err.message.includes("Quota") ||
        err.message.includes("rate")
      ) {
        console.log(`Rate limit hit. Waiting ${retryDelay / 1000}s`);
        await sleep(retryDelay);
        retryDelay *= 2;
        i--; // retry same chunk
        continue;
      }

      // real error — propagate
      throw err;
    }
  }

  return finalSummary.trim();
};
