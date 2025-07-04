// controllers/LeadController.js
const Lead = require("../../models/leadmanagment/Leadmodel");
const LeadNote = require("../../models/leadmanagment/Leadnotesmodel");
exports.createLead = async (req, res) => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Ensure values are arrays (JSON fields)
    const formatField = (field) => {
      if (Array.isArray(field)) return field;
      if (typeof field === "string") return field.split(",");
      return [];
    };

    const lead = await Lead.create({
      ...req.body,
      material: formatField(req.body.material),
      quantity: formatField(req.body.quantity),
      unit: formatField(req.body.unit),
      size: formatField(req.body.size),
      give_range: formatField(req.body.give_range),
      date: tomorrow
    });

    res.status(201).json(lead);
  } catch (error) {
    console.error("Create Lead Error:", error);
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

    const formatField = (field) => {
      if (Array.isArray(field)) return field;
      if (typeof field === "string") return field.split(",");
      return [];
    };

    const {
      material,
      quantity,
      unit,
      size,
      give_range,
      ...otherFields
    } = req.body;

    await lead.update({
      ...otherFields,
      material: formatField(material),
      quantity: formatField(quantity),
      unit: formatField(unit),
      size: formatField(size),
      give_range: formatField(give_range),
    });

    res.status(200).json(lead);
  } catch (error) {
    console.error("Update Lead Error:", error);
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
