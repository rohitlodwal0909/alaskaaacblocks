const db = require("../../models");
const { Rising, Batching } = db;

// Create
exports.createRising = async (req, res) => {
  try {
    const today = new Date();
    const formatted = today.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    const rising = await Rising.create({
      mould_no: req.body.mould_no,
      hardness: req.body.hardness,
      temperature: req.body.temperature,
      rising_time: req.body.rising_time,
      rising_date: formatted,
      operator_name: req.body.operator_name,
      remark: req.body.remark
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
  include: [
    {
      model: Rising,
      as: "rising_info",
      required:false
      },
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

    await rising.destroy();
    res.json({ message: "Rising entry deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};