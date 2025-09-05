const { createLogEntry } = require("../../helper/createLogEntry");
const db = require("../../models");
const {
  Batching,
  Rising,
  Cutting,
  Autoclave,
  Segregation,
  AuthModel,
  FinishGood
} = db;
const { Op, fn, col, literal, where } = require("sequelize");
// CREATE Segregation entry

exports.createSegregation = async (req, res) => {
  try {
    const segregationEntry = await Segregation.create({
      user_id: req.body.user_id,
      size: req.body.size,
      no_of_broken_pcs: req.body.no_of_broken_pcs,
      no_of_ok_pcs: req.body.no_of_ok_pcs,
      plate_no: req.body.plate_no,
      remark: req.body.remark,
      operator_name: req.body.operator_name,
      date: req.body.datetime
    });

    if (req.body.size && req.body.no_of_ok_pcs) {
      await FinishGood.create({
        size: req.body.size,
        no_of_ok_pcs: req.body.no_of_ok_pcs
      });
    }

    const user_id = req.body.user_id;
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const user = await AuthModel.findByPk(user_id);
    const username = user ? user?.name : "Unknown User";
    const logMessage = `Segregation  mould number ${req.body.mould_no}  was created by ${username} on ${entry_date} at ${entry_time}.`;
    await createLogEntry({
      user_id,
      message: logMessage
    });

    res.status(201).json({
      message: "Segregation entry created successfully",
      data: segregationEntry
    });
  } catch (error) {
    console.error("Create Segregation Error:", error);
    res.status(500).json({ error: error.message });
  }
};
// GET all Cutting entries with related Segregation
exports.getAllSegregation = async (req, res) => {
  try {
    const { id } = req.params;

    const getdate = await Segregation.findOne({ where: { id } });

    if (!getdate) {
      return res.json([]);
    }

    const date = new Date(getdate.date).toISOString().split("T")[0];

    const data = await Segregation.findAll({
      required: true,
      where: where(fn("DATE", col("date")), Op.eq, date)
    });

    res.json(data);
  } catch (error) {
    console.error("Get All Segregation Error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAutoclaveData = async (req, res) => {
  try {
    const data = await Segregation.findAll({
      attributes: [
        [fn("DATE", col("date")), "Date"],
        [fn("COUNT", col("id")), "total_records"],
        [fn("MIN", col("id")), "sample_id"]
      ],
      where: { deleted_at: null },
      group: [fn("DATE", col("date"))],
      order: [[literal("date"), "DESC"]]
    });

    res.json(data);
  } catch (error) {
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
      plate_no: req.body.plate_no,
      operator_name: req.body.operator_name
    });

    const user_id = segregation?.user_id;
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
    const user = await AuthModel.findByPk(user_id);
    const username = user ? user?.name : "Unknown User";
    const logMessage = `Segregation mould number ${segregation?.mould_no}  was updated by ${username} on ${entry_date} at ${entry_time}.`;
    await createLogEntry({
      user_id,
      message: logMessage
    });
    res.json({
      message: "Segregation entry updated successfully",
      data: segregation
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
    const user_id = segEntry?.user_id;
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
    const user = await AuthModel.findByPk(user_id);
    const username = user ? user?.name : "Unknown User";
    const logMessage = `Segregation mould number ${segEntry?.mould_no}  was deleted by ${username} on ${entry_date} at ${entry_time}.`;
    await createLogEntry({
      user_id,
      message: logMessage
    });
    await segEntry.destroy(); // soft delete (paranoid: true)
    res.json({ message: "Segregation entry deleted successfully" });
  } catch (error) {
    console.error("Delete Segregation Error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.createFinishGood = async (req, res) => {
  try {
    const finish = await FinishGood.create({
      size: req.body.size,
      no_of_ok_pcs: req.body.no_of_ok_pcs
    });
    res.status(201).json({
      message: "Finish good  entry created successfully",
      data: finish
    });
  } catch (error) {
    console.error("Create Segregation Error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getFinishGood = async (req, res) => {
  try {
    const data = await FinishGood.findAll();
    res.json(data);
  } catch (error) {
    console.error("Get All Segregation Error:", error);
    res.status(500).json({ error: error.message });
  }
};
