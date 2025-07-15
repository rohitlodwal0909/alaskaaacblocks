const express = require("express");
const router = express.Router();
const AuthController = require("../../controllers/authentication/AuthController");

router.post("/api/login", AuthController.login);
router.put("/api/update-profile/:id", AuthController.updateProfile);
router.get("/api/get-profile/:id", AuthController.getProfileById);

module.exports = router;
