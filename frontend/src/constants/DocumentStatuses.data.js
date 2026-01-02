export const DOCUMENT_STATUSES = {
  IDLE: "idle",

  TRANSLATING: "translating",
  TRANSLATED: "translated",
  TRANSLATION_FAILED: "translation_failed",

  SUMMARIZING: "summarizing",
  SUMMARY_COMPLETED: "summary_completed",
  SUMMARY_SAMPLE: "summary_sample",
  SUMMARY_FAILED: "summary_failed",

  EXTRACTING: "extracting",
  EXTRACTION_COMPLETED: "extraction_completed",
  EXTRACTION_SAMPLE: "extraction_sample",
  EXTRACTION_FAILED: "extraction_failed",
};

 export const SAMPLE_SUMMARY = `
This document appears to be a legal real estate related agreement.
It contains details about ownership, registration, and monetary value.
(This is sample summary due to AI quota limitations.)
`;

export const SAMPLE_EXTRACTION = {
  buyer: "Sample Buyer",
  seller: "Sample Seller",
  house_no: "123",
  survey_no: "45A",
  document_no: "DOC-XXXX",
  date: "2024-01-01",
  value: "₹10,00,000",
  note: "Sample data due to AI quota limit"
};