const express = require("express");
const router = express.Router();
const SecurityController = require("../../controllers/security/securityController");

router.post("/api/store-security", SecurityController.createSecurity);
router.get("/api/get-security/:id", SecurityController.getSecurity);
router.get("/api/get-security-date", SecurityController.getSecurityDate);
router.delete("/api/delete-security/:id", SecurityController.deleteSecurity);
router.put("/api/update-security/:id", SecurityController.updateSecurity);

module.exports = router;
