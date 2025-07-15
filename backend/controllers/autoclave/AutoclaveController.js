const db = require("../../models");
const {  Cutting, Autoclave } = db;

// CREATE Autoclave entry
exports.createAutoclave = async (req, res) => {
  try {
    const autoclave = await Autoclave.create({
      mould_no: req.body.mould_no,
      operator_name: req.body.operator_name,
      on_time: req.body.on_time,
      door_steam_time: req.body.door_steam_time,
      vacuum_steam_time: req.body.vacuum_steam_time,
      steam_pressure: req.body.steam_pressure,
      remark: req.body.remark,
    });

    res.status(201).json({
      message: "Autoclave entry created successfully",
      data: autoclave,
    });
  } catch (error) {
    console.error("Create Autoclave Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// GET all Cutting entries with related Autoclave
exports.getAllAutoclave = async (req, res) => {
  try {
    const data = await Cutting.findAll({
      include: [
        {
          model: Autoclave,
          as: "autoclave_entries", 
          required: false,
        },
      ],
    });

    res.json(data);
  } catch (error) {
    console.error("Get All Autoclave Error:", error);
    res.status(500).json({ error: error.message });
  }
};



// Read By ID
exports.getAutoclaveById = async (req, res) => {
  
  try {
    const autoclave = await Autoclave.findByPk(req.params.id);
    if (!autoclave)
      return res.status(404).json({ message: "Autoclave entry not found" });

    res.json(autoclave);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// UPDATE
exports.updateAutoclave = async (req, res) => {
  try {
    const autoclave = await Autoclave.findByPk(req.params.id);

    if (!autoclave) {
      return res.status(404).json({ message: "Autoclave entry not found" });
    }

    await autoclave.update({
      operator_name: req.body.operator_name,
      on_time: req.body.on_time,
      door_steam_time: req.body.door_steam_time,
      vacuum_steam_time: req.body.vacuum_steam_time,
      steam_pressure: req.body.steam_pressure,
      remark: req.body.remark,
    });

    res.json({
      message: "Autoclave entry updated successfully",
      data: autoclave,
    });
  } catch (error) {
    console.error("Update Autoclave Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE (soft delete)
exports.deleteAutoclave = async (req, res) => {
  try {
    const autoclave = await Autoclave.findByPk(req.params.id);
    if (!autoclave) {
      return res.status(404).json({ message: "Autoclave entry not found" });
    }

    await autoclave.destroy(); // soft delete (paranoid: true)
    res.json({ message: "Autoclave entry deleted successfully" });
  } catch (error) {
    console.error("Delete Autoclave Error:", error);
    res.status(500).json({ error: error.message });
  }
};