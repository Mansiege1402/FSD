const express = require("express");
const { createReview, getNgoReviews } = require("../controllers/reviewController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { idParamValidator } = require("../validators/commonValidator");
const { ROLES } = require("../utils/roles");

const router = express.Router();

router.get("/ngo/:id", idParamValidator, validate, getNgoReviews);
router.post("/", protect, authorizeRoles(ROLES.VOLUNTEER), createReview);

module.exports = router;
