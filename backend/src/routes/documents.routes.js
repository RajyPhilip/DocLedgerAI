const express = require("express");
const upload = require("../middlewares/upload.middleware");
const auth = require("../middlewares/auth.middleware");
const controller = require("../controllers/documents.controller");

const router = express.Router();

router.post("/", auth, upload.single("file"), controller.uploadDocument);
router.get("/", auth, controller.getDocuments);
router.delete("/:id", auth, controller.deleteDocument);

module.exports = router;
