const express = require("express");
const auth = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const controller = require("../controllers/documents.controller");

const router = express.Router();

router.post("/upload", auth, upload.any(), controller.uploadDocument);
router.get("/", auth, controller.getDocuments);
router.patch("/:id", auth, controller.updateDocumentName);
router.delete("/:id", auth, controller.deleteDocument);

module.exports = router;
