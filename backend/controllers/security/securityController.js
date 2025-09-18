const db = require("../../models");
const { Security } = db;
const { Op, fn, col, literal, where } = require("sequelize");
const dayjs = require("dayjs");

// Create

exports.createSecurity = async (req, res) => {
  try {
    const today = req.body.date_time;
    const finalDate = dayjs(today)
      .locale("en") // ensure English month short name
      .format("DD MMM YYYY, hh:mm a");

    const log = await Security.create({
      ...req.body,
      datetime: finalDate
    });

    res.status(201).json({
      message: "Security created successfully",
      data: log
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create security log", error });
  }
};

exports.getSecurity = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await Security.findOne({
      where: { id }
    });

    if (!record) {
      return res.json([]);
    }

    const dateOnly = record.created_at.toISOString().split("T")[0];

    const logs = await Security.findAll({
      where: {
        created_at: {
          [Op.gte]: new Date(`${dateOnly} 00:00:00`),
          [Op.lte]: new Date(`${dateOnly} 23:59:59`)
        }
      },
      order: [["created_at", "DESC"]]
    });

    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch", error });
  }
};

exports.getSecurityDate = async (req, res) => {
  try {
    const logs = await Security.findAll({
      attributes: [
        [fn("DATE", col("created_at")), "date"],
        [fn("COUNT", col("id")), "total_records"],
        [fn("MIN", col("id")), "id"],
        [fn("MIN", col("datetime")), "datetime"]
      ],
      where: { deleted_at: null },
      group: [fn("DATE", col("created_at"))],
      order: [[fn("DATE", col("created_at")), "DESC"]]
    });

    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch", error });
  }
};

exports.deleteSecurity = async (req, res) => {
  try {
    const { id } = req.params;

    const log = await Security.findByPk(id);
    if (!log) {
      return res.status(404).json({ message: "Security log not found" });
    }

    await log.destroy(); // if paranoid:true → soft delete

    res.json({ message: "Security log deleted successfully", id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete log", error });
  }
};

exports.updateSecurity = async (req, res) => {
  try {
    const { id } = req.body;

    const entry = await Security.findByPk(id);
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Security entry not found"
      });
    }

    await entry.update(req.body);

    return res.status(200).json({
      success: true,
      message: "Security log updated successfully",
      data: entry
    });
  } catch (error) {
    console.error("Error in updateSecurity:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update security log"
    });
  }
};
