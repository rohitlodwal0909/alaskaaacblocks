const express = require("express");
const router = express.Router();
const CuttingController = require("../../controllers/cutting/CuttingController");

router.post("/api/store-cutting", CuttingController.createCutting);
router.get("/api/get-cutting/:id", CuttingController.getAllCutting);
router.get("/api/get-risingdate", CuttingController.getRisingDate);
router.put("/api/update-cutting/:id", CuttingController.updateCutting);
router.delete("/api/delete-cutting/:id", CuttingController.deleteCutting);

module.exports = router;
