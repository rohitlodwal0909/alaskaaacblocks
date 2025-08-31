const { createLogEntry } = require("../../helper/createLogEntry");
const db = require("../../models");
const { Rising, Batching, AuthModel } = db;

// Create
exports.createRising = async (req, res) => {
  try {
    const today = new Date();
    const formatted = today.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata"
    });

    const rising = await Rising.create({
      user_id: req.body?.user_id,
      mould_no: req.body.mould_no,
      hardness: req.body.hardness,
      temperature: req.body.temperature,
      rising_time: req.body.rising_time,
      rising_date: formatted,
      operator_name: req.body.operator_name,
      remark: req.body.remark
    });
    const user_id = req?.body?.user_id;
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
    const user = await AuthModel.findByPk(user_id);
    const username = user ? user?.name : "Unknown User";
    const logMessage = `Rising mould number ${req.body.mould_no}  was created by ${username} on ${entry_date} at ${entry_time}.`;
    await createLogEntry({
      user_id,
      message: logMessage
    });
    res.status(201).json(rising);
  } catch (error) {
    console.error("Create Rising Error:", error);
    res.status(500).json({ error: error.message });
  }
};
exports.getAllRising = async (req, res) => {
  try {
    const batchings = await Batching.findAll({
      where: {
        deleted_at: null // Only non-deleted Rising entries
      },
      include: [
        {
          model: Rising,
          as: "rising_info",
          required: false
        }
      ]
    });
    res.json(batchings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read By ID
exports.getRisingById = async (req, res) => {
  try {
    const rising = await Rising.findByPk(req.params.id);
    if (!rising)
      return res.status(404).json({ message: "Rising entry not found" });

    res.json(rising);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update
exports.updateRising = async (req, res) => {
  try {
    const rising = await Rising.findByPk(req.params.id);
    if (!rising)
      return res.status(404).json({ message: "Rising entry not found" });

    await rising.update({
      mould_no: req.body.mould_no,
      hardness: req.body.hardness,
      temperature: req.body.temperature,
      rising_time: req.body.rising_time,
      operator_name: req.body.operator_name,
      remark: req.body.remark
    });
    const user_id = rising?.user_id;
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
    const user = await AuthModel.findByPk(user_id);
    const username = user ? user?.name : "Unknown User";
    const logMessage = `Rising  mould number ${req.body.mould_no}  was updated by ${username} on ${entry_date} at ${entry_time}.`;
    await createLogEntry({
      user_id,
      message: logMessage
    });
    res.json(rising);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete
exports.deleteRising = async (req, res) => {
  try {
    const rising = await Rising.findByPk(req.params.id);
    if (!rising)
      return res.status(404).json({ message: "Rising entry not found" });
    const user_id = rising?.user_id;
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
    const user = await AuthModel.findByPk(user_id);
    const username = user ? user?.name : "Unknown User";
    const logMessage = `Rising  mould number ${rising?.mould_no}  was deleted by ${username} on ${entry_date} at ${entry_time}.`;
    await createLogEntry({
      user_id,
      message: logMessage
    });
    await rising.destroy();
    res.json({ message: "Rising entry deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
