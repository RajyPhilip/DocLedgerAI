const { getGeminiClient } = require("../lib/geminiClient");

exports.extractStructuredData = async (englishText) => {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  const prompt = `
Extract structured data from this legal document.
Return STRICT JSON only.

Required keys:
- docNo
- executionDate
- registrationDate
- nature
- considerationValue
- marketValue
- surveyNumbers
- plotNumber
- extent

Text:
${englishText}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return JSON.parse(response.text());
};
