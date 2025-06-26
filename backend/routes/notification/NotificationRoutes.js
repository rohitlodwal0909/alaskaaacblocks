const express = require("express");
const router = express.Router();
const NotificationController = require("../../controllers/notification/NotificationController");

router.get(
  "/api/get-all-notification",
  NotificationController.getAllNotification
);
router.get(
  "/api/read-notification/:id",
  NotificationController.readNotification
);

module.exports = router;




