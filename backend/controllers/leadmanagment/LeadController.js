// controllers/LeadController.js
const Lead = require("../../models/leadmanagment/Leadmodel");
const LeadNote = require("../../models/leadmanagment/Leadnotesmodel");

// Create new lead
exports.createLead = async (req, res) => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const lead = await Lead.create({
      ...req.body,
      date: tomorrow
    });
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

// Update lead status only
exports.addNotes = async (req, res) => {
  try {
    const Leadnotes = await LeadNote.create(req.body);
    res.status(200).json(Leadnotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLeadNotes = async (req, res) => {
  const lead_id = req.params.id;
 
  
  try {
   const notes = await LeadNote.findAll({
      where: { lead_id: lead_id }, // make sure id is passed as a number or string that matches
      order: [['id', 'DESC']] // optional
    });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
