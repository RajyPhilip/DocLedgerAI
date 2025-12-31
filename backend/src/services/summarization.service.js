const { getGeminiClient } = require("../lib/geminiClient");

exports.generateSummary = async (englishText) => {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  const prompt = `
Summarize the following legal document in clear bullet points.
Keep it concise and factual.

Text:
${englishText}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text().trim();
};
