// routes/leadRoutes.js
const express = require("express");
const router = express.Router();
const BatchingController = require("../../controllers/batching/BatchingController");

router.post("/api/create-batching", BatchingController.createBatching);
router.get(
  "/api/get-batching-datewise",
  BatchingController.getBatchingDatewise
);
router.get("/api/get-all-batching/:id", BatchingController.getBatching);
router.put("/api/update-batching/:id", BatchingController.updateBatching);
router.delete("/api/delete-batching/:id", BatchingController.deleteBatching);

module.exports = router;
