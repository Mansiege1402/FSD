const express = require("express");
const { createDonation, getDonations } = require("../controllers/donationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getDonations);
router.post("/", protect, createDonation);

module.exports = router;
