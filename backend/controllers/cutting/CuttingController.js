const db = require("../../models");
const { Rising, Cutting } = db;

exports.createCutting = async (req, res) => {
  try {
    const cutting = await Cutting.create({
      mould_no: req.body.mould_no,
      operator_name: req.body.operator_name,
      size: req.body.size,
      broken_pcs: req.body.broken_pcs,
      time: req.body.time,
      remark: req.body.remark,
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

    await rising.destroy();
    res.json({ message: "Rising entry deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};