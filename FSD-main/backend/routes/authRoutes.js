const express = require("express");
const { register, login, refresh, logout } = require("../controllers/authController");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/rateLimiter");
const {
  registerValidator,
  loginValidator,
  refreshValidator
} = require("../validators/authValidator");

const router = express.Router();

router.post("/register", authLimiter, registerValidator, validate, register);
router.post("/login", authLimiter, loginValidator, validate, login);
router.post("/refresh", refreshValidator, validate, refresh);
router.post("/logout", protect, refreshValidator, validate, logout);

module.exports = router;
