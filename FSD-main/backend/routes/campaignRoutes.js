const express = require("express");
const {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign
} = require("../controllers/campaignController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { campaignValidator, idParamValidator } = require("../validators/commonValidator");
const { ROLES } = require("../utils/roles");

const router = express.Router();

router.get("/", getCampaigns);
router.get("/:id", idParamValidator, validate, getCampaignById);
router.post("/", protect, authorizeRoles(ROLES.NGO, ROLES.ADMIN), campaignValidator, validate, createCampaign);
router.patch("/:id", protect, authorizeRoles(ROLES.NGO, ROLES.ADMIN), idParamValidator, validate, updateCampaign);

module.exports = router;
