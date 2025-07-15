const db = require("../../models");
const { Autoclave, Segregation } = db;

// CREATE Segregation entry

exports.createSegregation = async (req, res) => {
  try {
    const segregationEntry = await Segregation.create({
      mould_no: req.body.mould_no,
      size: req.body.size,
      no_of_broken_pcs: req.body.no_of_broken_pcs,
      no_of_ok_pcs: req.body.no_of_ok_pcs,
      remark: req.body.remark,
      operator_name: req.body.operator_name,
      date: new Date(),
     
    });

    res.status(201).json({
      message: "Segregation entry created successfully",
      data: segregationEntry,
    });
  } catch (error) {
    console.error("Create Segregation Error:", error);
    res.status(500).json({ error: error.message });
  }
};
// GET all Cutting entries with related Segregation
exports.getAllSegregation = async (req, res) => {
  try {
    const data = await Autoclave.findAll({
      include: [
        {
          model: Segregation,
          as: "segregation_entries", 
          required: false,
        },
      ],
    });

    res.json(data);
  } catch (error) {
    console.error("Get All Segregation Error:", error);
    res.status(500).json({ error: error.message });
  }
};



// Read By ID
exports.getSegregationById = async (req, res) => {
  
  try {
    const Segregation = await Segregation.findByPk(req.params.id);
    if (!Segregation)
      return res.status(404).json({ message: "Segregation entry not found" });

    res.json(Segregation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
exports.updateSegregation = async (req, res) => {
  try {
    const segregation = await Segregation.findByPk(req.params.id);

    if (!segregation) {
      return res.status(404).json({ message: "Segregation entry not found" });
    }

    await segregation.update({
      mould_no: req.body.mould_no,
      size: req.body.size,
      no_of_broken_pcs: req.body.no_of_broken_pcs,
      no_of_ok_pcs: req.body.no_of_ok_pcs,
      remark: req.body.remark,
      operator_name: req.body.operator_name,
     
    });

    res.json({
      message: "Segregation entry updated successfully",
      data: segregation,
    });
  } catch (error) {
    console.error("Update Segregation Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE (soft delete)
exports.deleteSegregation = async (req, res) => {
  try {
    const segEntry = await Segregation.findByPk(req.params.id);
    if (!segEntry) {
      return res.status(404).json({ message: "Segregation entry not found" });
    }

    await segEntry.destroy(); // soft delete (paranoid: true)
    res.json({ message: "Segregation entry deleted successfully" });
  } catch (error) {
    console.error("Delete Segregation Error:", error);
    res.status(500).json({ error: error.message });
  }
};