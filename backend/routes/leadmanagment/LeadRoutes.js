// routes/leadRoutes.js
const express = require("express");
const router = express.Router();
const LeadController = require("../../controllers/leadmanagment/LeadController");

router.post("/api/create-lead", LeadController.createLead);
router.get("/api/get-all-leads", LeadController.getAllLeads);
router.put("/api/update-leads/:id", LeadController.updateLead);
router.delete("/api/delete-leads/:id", LeadController.deleteLead);
router.patch("/api/update-status/:id/status", LeadController.updateStatus);

module.exports = router;
