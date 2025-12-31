const { getGeminiClient } = require("../lib/geminiClient");

exports.translateTamilToEnglish = async (tamilText) => {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash", // fast + free-tier friendly
  });

  const prompt = `
You are a professional legal document translator.
Translate the following Tamil text into accurate English.
Preserve legal meaning and structure.

Tamil Text:
${tamilText}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text().trim();
};
