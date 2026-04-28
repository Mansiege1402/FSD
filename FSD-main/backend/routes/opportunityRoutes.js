const express = require("express");
const {
  createOpportunity,
  getAllOpportunities,
  getMyOpportunities,
  updateOpportunity,
  deleteOpportunity
} = require("../controllers/opportunityController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const {
  opportunityValidator,
  opportunityUpdateValidator,
  opportunityListValidator
} = require("../validators/opportunityValidator");
const { ROLES } = require("../utils/roles");

const router = express.Router();

router.get("/", opportunityListValidator, validate, getAllOpportunities);
router.get("/mine", protect, authorizeRoles(ROLES.NGO), getMyOpportunities);
router.post("/", protect, authorizeRoles(ROLES.NGO), opportunityValidator, validate, createOpportunity);
router.put(
  "/:id",
  protect,
  authorizeRoles(ROLES.NGO),
  opportunityUpdateValidator,
  validate,
  updateOpportunity
);
router.delete("/:id", protect, authorizeRoles(ROLES.NGO), opportunityUpdateValidator, validate, deleteOpportunity);

module.exports = router;
