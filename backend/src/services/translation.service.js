const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

exports.translateTamilToEnglish = async (textChunks) => {
  // UPDATED: Use the current 2.5 or 3
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash", 
  });

  let translatedText = "";
  let retryDelay = 20000; // Start with 20 seconds

  for (let i = 0; i < textChunks.length; i++) {
    console.log(`Translating chunk ${i + 1}/${textChunks.length}`);

    try {
      const result = await model.generateContent(
        `Translate the following Tamil legal document text into clear professional English.
        Return ONLY the translated English text.

        ${textChunks[i]}`
      );

      translatedText += "\n\n" + result.response.text();
      retryDelay = 20000; // Reset delay on success

      // Wait 5 seconds between successful chunks
      if (i < textChunks.length - 1) {
        await sleep(5000); 
      }
      
    } catch (error) {
      console.error(`Error in chunk ${i + 1}:`, error.message);

      if (error.message.includes("429") || error.message.includes("Quota")) {
        console.log(`Rate limit hit. Waiting ${retryDelay / 1000} seconds...`);
        await sleep(retryDelay);
        retryDelay *= 2; 
        i--; // Retry
      } else if (error.message.includes("404")) {
          console.error("Model version error. Please ensure you are using 'gemini-2.5-flash' or 'gemini-3-flash-preview'.");
          break;
      }
    }
  }

  return translatedText.trim();
};