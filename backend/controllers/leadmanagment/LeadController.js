// controllers/LeadController.js
const { createLogEntry } = require('../../helper/createLogEntry');
const db = require('../../models');
const { Op } = require("sequelize");
const { Lead,LeadNote,AuthModel,Notification}= db

exports.createLead = async (req, res) => {
  try {
    const {user_id, name} = req.body
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Ensure values are arrays (JSON fields)
    const formatField = (field) => {
      if (Array.isArray(field)) return field;
      if (typeof field === "string") return field.split(",");
      return [];
    };

const today = new Date();
    const formatted = today.toLocaleString('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

    const lead = await Lead.create({
      ...req.body,
      material: formatField(req.body.material),
      quantity: formatField(req.body.quantity),
      unit: formatField(req.body.unit),
      size: formatField(req.body.size),
      give_range: formatField(req.body.give_range),
      date: tomorrow,
      datetime:formatted
    });

     const now = new Date();
  const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
  const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
const user = await AuthModel.findByPk(user_id);
const username = user ? user?.name : "Unknown User";
const logMessage = `Leads name ${name}  was created by ${username} on ${entry_date} at ${entry_time}.`;
await createLogEntry({
  user_id,
  message:logMessage
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
    const leads = await Lead.findAll({
      order: [['created_at', 'DESC']], // descending order by createdAt
    });

    res.status(200).json(leads);
  } catch (error) {
    console.error("❌ Error in getAllLeads:", error);
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
     const user_id  = lead?.user_id
     const now = new Date();
  const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
  const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
const user = await AuthModel.findByPk(user_id);
const username = user ? user?.name : "Unknown User";
const logMessage = `Leads name ${lead?.name}  was updated by ${username} on ${entry_date} at ${entry_time}.`;
await createLogEntry({
  user_id,
  message:logMessage
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
 const user_id  = lead?.user_id
     const now = new Date();
  const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
  const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
const user = await AuthModel.findByPk(user_id);
const username = user ? user?.name : "Unknown User";
const logMessage = `Leads name ${lead?.name}  was deleted by ${username} on ${entry_date} at ${entry_time}.`;
await createLogEntry({
  user_id,
  message:logMessage
});

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
  const { followup_details, ...noteData } = req.body;
  try {
     const give_range = followup_details.map((item) => item.give_range);
    const quantity = followup_details.map((item) => item.quantity);
    const size = followup_details.map((item) => item.size);
    const Leadnotes = await LeadNote.create({
      ...noteData,
      give_range,
      quantity,
      size
    });
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
