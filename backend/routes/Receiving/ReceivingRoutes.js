
const express = require("express");
const router = express.Router();

const ReceivingController = require("../../controllers/Receiving/ReceivingController");

router.post("/api/store-receiving", ReceivingController.createReceiving);
router.get("/api/get-receiving", ReceivingController.getAllReceiving);
router.get("/api/receiving-signle/:id", ReceivingController.getReceivingById);
router.put("/api/update-receiving/:id", ReceivingController.updateReceiving);
router.delete("/api/delete-receiving/:id", ReceivingController.deleteReceiving);


module.exports = router;