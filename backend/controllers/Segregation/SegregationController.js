const { createLogEntry } = require("../../helper/createLogEntry");
const db = require("../../models");
const { Segregation, AuthModel, FinishGood } = db;
const { Op, fn, col, literal, where } = require("sequelize");
// CREATE Segregation entry

exports.createSegregation = async (req, res) => {
  try {
    // Create Segregation entry
    const segregationEntry = await Segregation.create({
      user_id: req.body.user_id,
      size: req.body.size,
      receive_blocks: req.body.receive_blocks,
      no_of_broken_pcs: req.body.no_of_broken_pcs,
      no_of_ok_pcs: req.body.no_of_ok_pcs,
      plate_no: req.body.plate_no,
      remark: req.body.remark,
      operator_name: req.body.operator_name,
      mould_no: req.body.mould_no, // ✅ include if exists in table
      date: req.body.datetime // or datetime: req.body.datetime if column name is different
    });

    // Create FinishGood if required
    let finishGoodEntry = null;
    if (req.body.size && req.body.no_of_ok_pcs) {
      finishGoodEntry = await FinishGood.create({
        seg_id: segregationEntry.id,
        size: req.body.size,
        no_of_ok_pcs: req.body.no_of_ok_pcs
      });
    }

    // Activity log
    const user_id = req.body.user_id;
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];

    const user = await AuthModel.findByPk(user_id);
    const username = user ? user.name : "Unknown User";

    const logMessage = `Segregation mould number ${
      req.body.mould_no || "-"
    } was created by ${username} on ${entry_date} at ${entry_time}.`;
    await createLogEntry({
      user_id,
      message: logMessage
    });

    // Response
    res.status(201).json({
      message: "Segregation entry created successfully",
      data: segregationEntry,
      finishGood: finishGoodEntry // include finish good info if created
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

    const result = [];
    for (const g of data) {
      // Access the alias you gave: g.get('Date')
      const date = g.get("Date");
      const data1 = await Segregation.findAll({
        where: where(fn("DATE", col("date")), date)
      });

      result.push({
        date,
        total_records: g.get("total_records"),
        sample_id: g.get("sample_id"),
        segrication_info: data1
      });
    }

    res.json(result);
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
    // Find segregation record
    const segregation = await Segregation.findByPk(req.params.id);

    if (!segregation) {
      return res.status(404).json({ message: "Segregation entry not found" });
    }

    // Update Segregation fields
    await segregation.update({
      mould_no: req.body.mould_no,
      size: req.body.size,
      receive_blocks: req.body.receive_blocks,
      no_of_broken_pcs: req.body.no_of_broken_pcs,
      no_of_ok_pcs: req.body.no_of_ok_pcs,
      remark: req.body.remark,
      plate_no: req.body.plate_no,
      operator_name: req.body.operator_name
    });

    // ✅ Update or create FinishGood if size & no_of_ok_pcs present
    let finishGoodEntry = null;
    if (req.body.size && req.body.no_of_ok_pcs) {
      finishGoodEntry = await FinishGood.findOne({
        where: { seg_id: segregation.id }
      });

      if (finishGoodEntry) {
        // update
        await finishGoodEntry.update({
          size: req.body.size,
          no_of_ok_pcs: req.body.no_of_ok_pcs
        });
      } else {
        // create new
        finishGoodEntry = await FinishGood.create({
          seg_id: segregation.id,
          size: req.body.size,
          no_of_ok_pcs: req.body.no_of_ok_pcs
        });
      }
    }

    // ✅ Activity log
    const user_id = segregation.user_id; // user_id from existing record
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const user = await AuthModel.findByPk(user_id);
    const username = user ? user.name : "Unknown User";

    const logMessage = `Segregation mould number ${
      req.body.mould_no || "-"
    } was updated by ${username} on ${entry_date} at ${entry_time}.`;

    await createLogEntry({
      user_id,
      message: logMessage
    });

    // ✅ Response
    res.json({
      message: "Segregation entry updated successfully",
      data: segregation,
      finishGood: finishGoodEntry // include updated finishGood info
    });
  } catch (error) {
    console.error("Update Segregation Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE (soft delete)
exports.deleteSegregation = async (req, res) => {
  try {
    // 1️⃣ Find Segregation entry
    const segEntry = await Segregation.findByPk(req.params.id);
    if (!segEntry) {
      return res.status(404).json({ message: "Segregation entry not found" });
    }

    // 2️⃣ Activity log
    const user_id = segEntry.user_id;
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
    const user = await AuthModel.findByPk(user_id);
    const username = user ? user.name : "Unknown User";
    const logMessage = `Segregation mould number ${
      segEntry.mould_no || "-"
    } was deleted by ${username} on ${entry_date} at ${entry_time}.`;

    await createLogEntry({
      user_id,
      message: logMessage
    });

    // 3️⃣ Optionally delete FinishGood entries linked to this segregation
    await FinishGood.destroy({
      where: { seg_id: segEntry.id } // soft delete if FinishGood model is paranoid: true
    });

    // 4️⃣ Delete (soft delete if paranoid)
    await segEntry.destroy();

    // 5️⃣ Response
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
