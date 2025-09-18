const express = require("express");
const router = express.Router();
const SegregationController = require("../../controllers/Segregation/SegregationController");

router.post("/api/store-segregation", SegregationController.createSegregation);
router.post("/api/store-finishgood", SegregationController.createFinishGood);
router.get("/api/get-segregation/:id", SegregationController.getAllSegregation);
router.get("/api/get-autoclave-date", SegregationController.getAutoclaveData);

router.get("/api/get-finishgood", SegregationController.getFinishGood);

router.get(
  "/api/segregation-signle/:id",
  SegregationController.getSegregationById
);
router.put(
  "/api/update-segregation/:id",
  SegregationController.updateSegregation
);
router.delete(
  "/api/delete-segregation/:id",
  SegregationController.deleteSegregation
);

module.exports = router;
