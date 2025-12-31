const PDFDocument = require("pdfkit");
const streamBuffers = require("stream-buffers");

exports.generateTranslatedPdf = async (text) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 });
    const bufferStream = new streamBuffers.WritableStreamBuffer();

    doc.pipe(bufferStream);
    doc.fontSize(12).text(text, { lineGap: 6 });
    doc.end();

    bufferStream.on("finish", () => {
      resolve(bufferStream.getContents());
    });
  });
};
