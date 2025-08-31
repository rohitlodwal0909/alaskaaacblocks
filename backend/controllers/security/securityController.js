const { createLogEntry } = require("../../helper/createLogEntry");
const db = require("../../models");
const { Security } = db;

// Create

exports.createSecurity = async (req, res) => {
  try {
    const log = await Security.create(req.body);
    res
      .status(201)
      .json({ message: "Security  created successfully", data: log });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create security log", error });
  }
};

exports.getSecurity = async (req, res) => {
  try {
    const logs = await Security.findAll({ order: [["created_at", "DESC"]] });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch ", error });
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
