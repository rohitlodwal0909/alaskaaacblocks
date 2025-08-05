const { createLogEntry } = require("../../helper/createLogEntry");
const db = require("../../models");
const { Rising, Cutting,AuthModel } = db;

exports.createCutting = async (req, res) => {
  try {
    const cutting = await Cutting.create({
      user_id:req.body.user_id,
      mould_no: req.body.mould_no,
      operator_name: req.body.operator_name,
      size: req.body.size,
      broken_pcs: req.body.broken_pcs,
      time: req.body.time,
      remark: req.body.remark,
    });

     const user_id = req.body.user_id;
           const now = new Date();
          const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
          const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
        const user = await AuthModel.findByPk(user_id);
        const username = user ? user?.name : "Unknown User";
        const logMessage = `Cutting  mould number ${req.body.mould_no}  was created by ${username} on ${entry_date} at ${entry_time}.`;
        await createLogEntry({
          user_id,
          message:logMessage
        });
    res.status(201).json({
      message: "Cutting entry created successfully",
      data: cutting,
    });
  } catch (error) {
    console.error("Create Cutting Error:", error);
    res.status(500).json({ error: error.message });
  }
};;
exports.getAllCutting = async (req, res) => {
  try {
    const data = await Rising.findAll({
      include: [
        {
          model: Cutting,
          as: "cutting_info", // must match hasOne alias
          required: false,
        },
      ],
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update
// Update Cutting
exports.updateCutting = async (req, res) => {
  try {
    const cutting = await Cutting.findByPk(req.params.id);

    if (!cutting) {
      return res.status(404).json({ message: "Cutting entry not found" });
    }

    await cutting.update({
    
      operator_name: req.body.operator_name,
      size: req.body.size,
      broken_pcs: req.body.broken_pcs,
      time: req.body.time,
      remark: req.body.remark,
    });
      const user_id = cutting?.user_id;
           const now = new Date();
          const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
          const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
        const user = await AuthModel.findByPk(user_id);
        const username = user ? user?.name : "Unknown User";
        const logMessage = `Cutting  mould number ${cutting?.mould_no}  was updated by ${username} on ${entry_date} at ${entry_time}.`;
        await createLogEntry({
          user_id,
          message:logMessage
        });

    res.json({
      message: "Cutting entry updated successfully",
      data: cutting,
    });
  } catch (error) {
    console.error("Update Cutting Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete
exports.deleteCutting= async (req, res) => {
  try {
    const rising = await Cutting.findByPk(req.params.id);
    if (!rising)
      return res.status(404).json({ message: "Rising entry not found" });

     const user_id = rising?.user_id;
           const now = new Date();
          const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
          const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
        const user = await AuthModel.findByPk(user_id);
        const username = user ? user?.name : "Unknown User";
        const logMessage = `Cutting  mould number ${rising?.mould_no}  was deleted by ${username} on ${entry_date} at ${entry_time}.`;
        await createLogEntry({
          user_id,
          message:logMessage
        });
    await rising.destroy();
    res.json({ message: "Rising entry deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};