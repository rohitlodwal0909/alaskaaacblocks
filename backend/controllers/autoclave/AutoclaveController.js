const { createLogEntry } = require("../../helper/createLogEntry");
const db = require("../../models");
const { Cutting, Autoclave, AuthModel, AutoclaveRecord, Rising, Batching } = db;
const { Op, fn, col, literal, where } = require("sequelize");

// CREATE Autoclave entry
exports.createAutoclave = async (req, res) => {
  try {
    const { autoclaveData, records } = req.body;

    const newAutoclave = await Autoclave.create({
      ...autoclaveData
    });

    // 🔹 Create related records (agar diye gaye ho)
    if (records && Array.isArray(records) && records.length > 0) {
      for (const record of records) {
        await AutoclaveRecord.create({
          ...record,
          autoclave_id: newAutoclave.id
        });
      }
    }

    const user_id = req.body.user_id;
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
    const user = await AuthModel.findByPk(user_id);
    const username = user ? user?.name : "Unknown User";
    const logMessage = `Autoclave  mould number ${req.body.mould_no}  was created by ${username} on ${entry_date} at ${entry_time}.`;
    await createLogEntry({
      user_id,
      message: logMessage
    });
    res.status(201).json({
      message: "Autoclave entry created successfully"
    });
  } catch (error) {
    console.error("Create Autoclave Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// GET all Cutting entries with related Autoclave
exports.getAllAutoclave = async (req, res) => {
  try {
    const { id } = req.params;

    const getdate = await Autoclave.findOne({ where: { id } });

    if (!getdate) {
      return res.json([]);
    }

    const date = new Date(getdate.datetime).toISOString().split("T")[0];

    const data = await Autoclave.findAll({
      where: where(fn("DATE", col("datetime")), Op.eq, date)
    });

    res.json(data);
  } catch (error) {
    console.error("Get All Autoclave Error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getCuttingdate = async (req, res) => {
  try {
    const data = await Autoclave.findAll({
      attributes: [
        [fn("DATE", col("datetime")), "Date"],
        [fn("COUNT", col("id")), "total_records"],
        [fn("MIN", col("id")), "sample_id"]
      ],
      where: { deleted_at: null },
      group: [fn("DATE", col("datetime"))],
      order: [[literal("datetime"), "DESC"]]
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read By ID
exports.getAutoclaveById = async (req, res) => {
  try {
    const autoclave = await Autoclave.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: AutoclaveRecord,
          as: "records",
          required: false
        }
      ]
    });

    if (!autoclave) {
      return res.status(404).json({ message: "Autoclave entry not found" });
    }

    res.json(autoclave);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
exports.updateAutoclave = async (req, res) => {
  try {
    const { id } = req.params;
    const { autoclaveData, records } = req.body;

    console.log(autoclaveData);
    console.log(records);

    // 🔹 Find main Autoclave
    const autoclave = await Autoclave.findByPk(id, {
      include: [{ model: AutoclaveRecord, as: "records" }]
    });

    if (!autoclave) {
      return res.status(404).json({ message: "Autoclave entry not found" });
    }

    // 🔹 Update Autoclave main fields
    await autoclave.update(autoclaveData);

    // 🔹 Update or create records
    if (records && Array.isArray(records)) {
      for (const record of records) {
        if (record.id) {
          // Update existing record
          await AutoclaveRecord.update(record, {
            where: { id: record.id, autoclave_id: id }
          });
        } else {
          // Create new record
          await AutoclaveRecord.create({
            ...record,
            autoclave_id: id
          });
        }
      }
    }

    // 🔹 Refetch updated autoclave with records
    const updatedAutoclave = await Autoclave.findByPk(id, {
      include: [{ model: AutoclaveRecord, as: "records" }]
    });

    res.json({
      message: "Autoclave updated successfully",
      data: updatedAutoclave
    });
  } catch (error) {
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
      message: logMessage
    });
    await autoclave.destroy(); // soft delete (paranoid: true)
    res.json({ message: "Autoclave entry deleted successfully" });
  } catch (error) {
    console.error("Delete Autoclave Error:", error);
    res.status(500).json({ error: error.message });
  }
};
