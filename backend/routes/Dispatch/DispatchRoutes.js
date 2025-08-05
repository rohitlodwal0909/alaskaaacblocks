
const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const DispatchController = require("../../controllers/dispatch/DispatchController");
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
router.post("/api/store-dispatch",upload.single('loading_picture'), DispatchController.createDispatch);
router.get("/api/get-dispatch", DispatchController.getAllDispatch);
router.get("/api/dispatch-signle/:id", DispatchController.getDispatchById);
router.put("/api/update-dispatch/:id",upload.single('loading_picture'), DispatchController.updateDispatch);
router.delete("/api/delete-dispatch/:id", DispatchController.deleteDispatch);


module.exports = router;