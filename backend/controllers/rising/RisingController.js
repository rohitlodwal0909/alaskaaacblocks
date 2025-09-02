const { createLogEntry } = require("../../helper/createLogEntry");
const db = require("../../models");
const { Rising, Batching, AuthModel } = db;
const { Op, fn, col, literal, where } = require("sequelize");

// Create
exports.createRising = async (req, res) => {
  try {
    const rising = await Rising.create({
      user_id: req.body?.user_id,
      batching_id: req.body.batching_id,
      hardness: req.body.hardness,
      temperature: req.body.temperature,
      rising_time: req.body.rising_time,
      rising_date: req.body.datetime,
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
    const { id } = req.params;

    // First get the record by id
    const data = await Batching.findOne({ where: { id } });
    if (!data) {
      return res.json([]);
    }

    // Extract only date part
    const date = data.batch_date;

    // Get all records of same date (ignoring time)
    const batchings = await Batching.findAll({
      where: where(fn("DATE", col("batch_date")), date),
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
