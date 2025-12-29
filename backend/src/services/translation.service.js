const { getOpenAIClient } = require("../lib/openaiClient");

exports.translateTamilToEnglish = async (tamilText) => {
  const openai = getOpenAIClient();

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a professional Tamil to English legal document translator."
      },
      {
        role: "user",
        content: tamilText
      }
    ],
  });

  return response.choices[0].message.content;
};
