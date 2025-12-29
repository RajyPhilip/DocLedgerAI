const express = require("express");
const auth = require("../middlewares/auth.middleware");
const {
  extractDocumentText,
  translateDocument,
  summarizeDocument,
} = require("../controllers/documentProcessing.controller");

const router = express.Router();

router.post("/documents/:id/extract", auth, extractDocumentText);
router.post("/documents/:id/translate", auth, translateDocument);
router.post("/documents/:id/summarize", auth, summarizeDocument);



module.exports = router;
