const express = require("express");
const auth = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const controller = require("../controllers/documents.controller");
// const processingController = require("../controllers/documentProcessing.controller");

const router = express.Router();

router.post("/upload", auth, upload.any(), controller.uploadDocument);
router.get("/", auth, controller.getDocuments);
router.patch("/:id", auth, controller.updateDocumentName);
router.delete("/:id", auth, controller.deleteDocument);

router.get("/:id", auth, controller.getDocumentDetail);
router.post("/:id/translate", auth, controller.translateDocument);

// 🔜 future (you can add later)
/// router.post("/:id/summary", auth, processingController.generateSummary);
/// router.post("/:id/extract", auth, processingController.extractData);

module.exports = router;
