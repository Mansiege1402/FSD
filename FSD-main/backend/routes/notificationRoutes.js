const express = require("express");
const {
  getMyNotifications,
  createNotification,
  markNotificationAsRead
} = require("../controllers/notificationController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { ROLES } = require("../utils/roles");

const router = express.Router();

router.get("/me", protect, getMyNotifications);
router.post("/", protect, authorizeRoles(ROLES.ADMIN, ROLES.NGO), createNotification);
router.patch("/:id/read", protect, markNotificationAsRead);

module.exports = router;
