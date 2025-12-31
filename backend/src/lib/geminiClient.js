const { GoogleGenerativeAI } = require("@google/generative-ai");

let client;

exports.getGeminiClient = () => {
  if (!client) {
    client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return client;
};
