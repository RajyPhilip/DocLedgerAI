

const PDFDocument = require("pdfkit");

exports.generateTranslatedPdf = async (translatedText) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 40 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });

    doc.fontSize(11).text(translatedText, {
      align: "left",
      lineGap: 4,
    });

    doc.end();
  });
};