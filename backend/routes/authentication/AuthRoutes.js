const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const AuthController = require("../../controllers/authentication/AuthController");
// Setup multer
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });
router.post("/api/login", AuthController.login);
router.put("/api/update-profile/:id",upload.single('profile_image'), AuthController.updateProfile);
router.get("/api/get-profile/:id", AuthController.getProfileById);
router.put('/api/change-password/:id', AuthController.changePassword);
router.get('/api/get-log', AuthController.getAllLogs)
router.post("/api/forgot-password", AuthController.forgotPassword);
module.exports = router;
