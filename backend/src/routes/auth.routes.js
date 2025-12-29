const express = require("express");
const {
  signup,
  login,
  verifyUser,
} = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/verify-user", authMiddleware, (req, res) => {
  res.json({
    status: "success",
    data: { user: req.user },
  });
});

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
