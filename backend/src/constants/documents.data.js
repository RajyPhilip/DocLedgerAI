const DOCUMENT_STATUSES = {
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

const TRANSLATION_TIMEOUT_MS = 10 * 60 * 100;

module.exports = {
  DOCUMENT_STATUSES,TRANSLATION_TIMEOUT_MS
};