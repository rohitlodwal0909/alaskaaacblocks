// controllers/LeadController.js
const Lead = require("../../models/leadmanagment/Leadmodel");

// Create new lead
exports.createLead = async (req, res) => {
  try {
    
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all leads
exports.getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.findAll();
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update lead
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    await lead.update(req.body);
    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete lead
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    await lead.destroy();
    res.status(200).json({ message: "Lead deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update lead status only
exports.updateStatus = async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    lead.status = req.body.status;
    await lead.save();

    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
