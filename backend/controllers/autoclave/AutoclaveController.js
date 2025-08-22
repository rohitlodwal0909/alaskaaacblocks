const { createLogEntry } = require("../../helper/createLogEntry");
const db = require("../../models");
const {  Cutting, Autoclave,AuthModel } = db;

// CREATE Autoclave entry
exports.createAutoclave = async (req, res) => {
  try {
    const autoclave = await Autoclave.create({
      user_id:req.body.user_id,
      mould_no: req.body.mould_no,
      operator_name: req.body.operator_name,
      on_time: req.body.on_time,
      door_steam_time: req.body.door_steam_time,
      vacuum_steam_time: req.body.vacuum_steam_time,
      steam_pressure: req.body.steam_pressure,
      remark: req.body.remark,
    });

     const user_id = req.body.user_id;
               const now = new Date();
              const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
              const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
            const user = await AuthModel.findByPk(user_id);
            const username = user ? user?.name : "Unknown User";
            const logMessage = `Autoclave  mould number ${req.body.mould_no}  was created by ${username} on ${entry_date} at ${entry_time}.`;
            await createLogEntry({
              user_id,
              message:logMessage
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
      where: {
        deleted_at: null, // Only non-deleted Rising entries
      },
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
     const user_id = autoclave?.user_id;
           const now = new Date();
          const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
          const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
        const user = await AuthModel.findByPk(user_id);
        const username = user ? user?.name : "Unknown User";
        const logMessage = `Autoclave  mould number ${autoclave?.mould_no}  was updated by ${username} on ${entry_date} at ${entry_time}.`;
        await createLogEntry({
          user_id,
          message:logMessage
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

     const user_id = autoclave?.user_id;
           const now = new Date();
          const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
          const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
        const user = await AuthModel.findByPk(user_id);
        const username = user ? user?.name : "Unknown User";
        const logMessage = `Autoclave  mould number ${autoclave?.mould_no}  was deleted by ${username} on ${entry_date} at ${entry_time}.`;
        await createLogEntry({
          user_id,
          message:logMessage
        });
    await autoclave.destroy(); // soft delete (paranoid: true)
    res.json({ message: "Autoclave entry deleted successfully" });
  } catch (error) {
    console.error("Delete Autoclave Error:", error);
    res.status(500).json({ error: error.message });
  }
};