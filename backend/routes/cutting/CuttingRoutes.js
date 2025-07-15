
const express = require("express");
const router = express.Router();
const CuttingController = require("../../controllers/cutting/CuttingController");

router.post("/api/store-cutting", CuttingController.createCutting);
router.get("/api/get-cutting", CuttingController.getAllCutting);
router.put("/api/update-cutting/:id", CuttingController.updateCutting);
router.delete("/api/delete-cutting/:id", CuttingController.deleteCutting);


module.exports = router;