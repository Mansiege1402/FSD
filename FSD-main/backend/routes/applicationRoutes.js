const express = require("express");
const {
  applyToOpportunity,
  getMyApplications,
  updateApplicationStatus
} = require("../controllers/applicationController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const {
  createApplicationValidator,
  updateApplicationStatusValidator
} = require("../validators/applicationValidator");
const { ROLES } = require("../utils/roles");

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles(ROLES.VOLUNTEER, ROLES.USER),
  createApplicationValidator,
  validate,
  applyToOpportunity
);
router.get("/me", protect, authorizeRoles(ROLES.VOLUNTEER, ROLES.USER), getMyApplications);
router.patch(
  "/:id/status",
  protect,
  authorizeRoles(ROLES.NGO),
  updateApplicationStatusValidator,
  validate,
  updateApplicationStatus
);

module.exports = router;
