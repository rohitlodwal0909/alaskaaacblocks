// routes/risingRoutes.js
const express = require("express");
const router = express.Router();
const RisingController = require("../../controllers/rising/RisingController");


router.post("/api/store-rising", RisingController.createRising);
router.get("/api/get-rising", RisingController.getAllRising);
router.get("/api/view-rising/:id", RisingController.getRisingById);
router.put("/api/update-rising/:id", RisingController.updateRising);
router.delete("/api/delete-rising/:id", RisingController.deleteRising);


module.exports = router;