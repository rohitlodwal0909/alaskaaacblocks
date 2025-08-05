const { createLogEntry } = require("../../helper/createLogEntry");
const db = require("../../models");
const {  Material ,AuthModel} = db;

// CREATE Material entry
exports.createMaterial = async (req, res) => {
  try {
    const {
      mould_oil,
      receiving_id,
      slurry_waste,
      slurry_fresh,
      cement,
      lime,
      gypsum,
      soluble_oil,
      aluminium,
      density,
      flow_value,
      user_id,
    } = req.body;
    // Create material entry
    const materialEntry = await Material.create({
      mould_oil,
      receiving_id,
      user_id,
      slurry_waste,
      slurry_fresh,
      cement,
      lime,
      gypsum,
      soluble_oil,
      aluminium,
      density,
      flow_value,
    });

    // Log entry (optional)
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
    let username = "Unknown User";
    if (user_id) {
      const user = await AuthModel.findByPk(user_id);
      username = user ? user.name : "Unknown User";
    }
    const logMessage = `Material entry created by ${username} on ${entry_date} at ${entry_time}.`;
    await createLogEntry({
      user_id,
      message: logMessage,
    });
    res.status(201).json({
      message: "Material entry created successfully",
      data: materialEntry,
    });
  } catch (error) {
    console.error("Create Material Error:", error);
    res.status(500).json({ error: error.message });
  }
};
// GET all Cutting entries with related Material
exports.getAllMaterial = async (req, res) => {
  try {
    const data = await Material.findAll({
      where: {}, // optionally add filters here
      order: [['created_at', 'DESC']], // optional: latest first
    });

    res.status(200).json({
      message: "All Material entries fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Get All Material Error:", error);
    res.status(500).json({ error: error.message });
  }
};



// Read By ID
exports.getMaterialById = async (req, res) => {
  
  try {
    const Material = await Material.findByPk(req.params.id);
    if (!Material)
      return res.status(404).json({ message: "Material entry not found" });

    res.json(Material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
exports.updateMaterial = async (req, res) => {
  try {
    const MaterialEntry = await Material.findByPk(req.params.id);
    if (!MaterialEntry) {
      return res.status(404).json({ message: "Material entry not found" });
    }

    await MaterialEntry.update({
      mould_oil: req.body.mould_oil,
      slurry_waste: req.body.slurry_waste,
      slurry_fresh: req.body.slurry_fresh,
      cement: req.body.cement,
      lime: req.body.lime,
      gypsum: req.body.gypsum,
      soluble_oil: req.body.soluble_oil,
      aluminium: req.body.aluminium,
      density: req.body.density,
      flow_value: req.body.flow_value,
    });

    // 🔐 Logging
    const user_id = req.body.user_id;
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];

    const user = await AuthModel.findByPk(user_id);
    const username = user ? user.name : "Unknown User";

    const logMessage = `Material entry for ID ${MaterialEntry.id} was updated by ${username} on ${entry_date} at ${entry_time}.`;

    await createLogEntry({
      user_id,
      message: logMessage,
    });

    res.json({
      message: "Material entry updated successfully",
      data: MaterialEntry,
    });
  } catch (error) {
    console.error("Update Material Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE (soft delete)
exports.deleteMaterial = async (req, res) => {
  try {
    const segEntry = await Material.findByPk(req.params.id);
    if (!segEntry) {
      return res.status(404).json({ message: "Material entry not found" });
    }
        const user_id = segEntry?.user_id;
           const now = new Date();
          const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
          const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
        const user = await AuthModel.findByPk(user_id);
        const username = user ? user?.name : "Unknown User";
        const logMessage = `Material for vehicle number ${segEntry.vehicle_number} was deleted by ${username} on ${entry_date} at ${entry_time}.`;
        await createLogEntry({
          user_id,
          message:logMessage
        });
    await segEntry.destroy(); // soft delete (paranoid: true)
    res.json({ message: "Material entry deleted successfully" });
  } catch (error) {
    console.error("Delete Material Error:", error);
    res.status(500).json({ error: error.message });
  }
};