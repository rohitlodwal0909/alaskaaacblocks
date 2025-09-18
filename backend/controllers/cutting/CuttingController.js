const { createLogEntry } = require("../../helper/createLogEntry");
const db = require("../../models");
const { Rising, Cutting, AuthModel, Batching } = db;
const { Op, fn, col, literal, where } = require("sequelize");

exports.createCutting = async (req, res) => {
  try {
    const cutting = await Cutting.create({
      user_id: req.body.user_id,
      mould_no: req.body.mould_no,
      operator_name: req.body.operator_name,
      rising_id: req.body.rising_id,
      size: req.body.size,
      broken_pcs: req.body.broken_pcs,
      middle_crack: req.body.middle_crack,
      ok_pcs: req.body.ok_pcs,
      time: req.body.time,
      datetime: req.body.datetime,
      remark: req.body.remark
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
      message: logMessage
    });
    res.status(201).json({
      message: "Cutting entry created successfully",
      data: cutting
    });
  } catch (error) {
    console.error("Create Cutting Error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllCutting = async (req, res) => {
  try {
    const { id } = req.params;

    const getdate = await Rising.findOne({ where: { id, deleted_at: null } });

    if (!getdate) {
      return res.json([]);
    }

    const date = new Date(getdate.rising_date).toISOString().split("T")[0];

    const data = await Batching.findAll({
      where: {
        deleted_at: null
      },
      include: [
        {
          model: Rising,
          where: where(fn("DATE", col("rising_date")), date),
          deleted_at: null,
          as: "rising_info",
          required: true,
          include: [
            {
              model: Cutting,
              as: "cutting_info",
              required: false,
              where: {
                deleted_at: null
              }
            }
          ]
        }
      ]
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRisingDate = async (req, res) => {
  try {
    const data = await Rising.findAll({
      attributes: [
        [fn("DATE", col("rising_date")), "Date"],
        [fn("COUNT", col("id")), "total_records"],
        [fn("MIN", col("id")), "sample_id"]
      ],
      where: { deleted_at: null },
      group: [fn("DATE", col("rising_date"))],
      order: [[literal("rising_date"), "DESC"]]
    });

    const result = [];
    for (const g of data) {
      // Access the alias you gave: g.get('Date')
      const date = g.get("Date");
      const data1 = await Rising.findAll({
        where: where(fn("DATE", col("rising_date")), date),
        include: [
          {
            model: Cutting,
            as: "cutting_info",
            required: false,
            where: { deleted_at: null }
          }
        ]
      });

      result.push({
        date,
        total_records: g.get("total_records"),
        sample_id: g.get("sample_id"),
        rising_info: data1
      });
    }

    res.json(result);
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
      ok_pcs: req.body.ok_pcs,
      middle_crack: req.body.middle_crack,
      time: req.body.time,
      remark: req.body.remark
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
      message: logMessage
    });

    res.json({
      message: "Cutting entry updated successfully",
      data: cutting
    });
  } catch (error) {
    console.error("Update Cutting Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete
exports.deleteCutting = async (req, res) => {
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
      message: logMessage
    });
    await rising.destroy();
    res.json({ message: "Rising entry deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
