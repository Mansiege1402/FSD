const express = require("express");
const { getNgos, getNgoProfile, updateNgoVerification } = require("../controllers/ngoController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { idParamValidator } = require("../validators/commonValidator");
const { ROLES } = require("../utils/roles");

const router = express.Router();

router.get("/", getNgos);
router.get("/:id", idParamValidator, validate, getNgoProfile);
router.patch("/:id/verify", protect, authorizeRoles(ROLES.ADMIN), idParamValidator, validate, updateNgoVerification);

module.exports = router;
