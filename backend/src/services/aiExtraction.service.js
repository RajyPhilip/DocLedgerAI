const { getOpenAIClient } = require("../lib/openaiClient");

exports.extractStructuredData = async (text) => {
  const openai = getOpenAIClient();

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Extract structured transaction data as valid JSON."
      },
      {
        role: "user",
        content: text
      }
    ],
  });

  return JSON.parse(response.choices[0].message.content);
};
