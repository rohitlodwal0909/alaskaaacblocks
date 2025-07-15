
const express = require("express");
const router = express.Router();
const SegregationController = require("../../controllers/Segregation/SegregationController");

router.post("/api/store-segregation", SegregationController.createSegregation);
router.get("/api/get-segregation", SegregationController.getAllSegregation);
router.get("/api/segregation-signle/:id", SegregationController.getSegregationById);
router.put("/api/update-segregation/:id", SegregationController.updateSegregation);
router.delete("/api/delete-segregation/:id", SegregationController.deleteSegregation);


module.exports = router;