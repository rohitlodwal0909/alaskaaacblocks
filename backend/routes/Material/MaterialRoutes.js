
const express = require("express");
const router = express.Router();

const MaterialController = require("../../controllers/material/MaterialController");

router.post("/api/store-material", MaterialController.createMaterial);
router.get("/api/get-material", MaterialController.getAllMaterial);
router.get("/api/material-signle/:id", MaterialController.getMaterialById);
router.put("/api/update-material/:id", MaterialController.updateMaterial);
router.delete("/api/delete-material/:id", MaterialController.deleteMaterial);


module.exports = router;