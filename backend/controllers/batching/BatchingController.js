const { createLogEntry } = require("../../helper/createLogEntry");
const db = require("../../models");
const { Batching, Rising, Material, AuthModel } = db;
const { Op, fn, col, literal, where } = require("sequelize");

exports.createBatching = async (req, res) => {
  try {
    const {
      user_id,
      shift,
      operator_name,
      mould_no,
      slurry_waste,
      slurry_fresh,
      cement_qty,
      lime_qty,
      gypsum_qty,
      soluble_oil_qty,
      aluminium_qty,
      mould_oil_qty,
      density,
      flow_value,
      temperature,
      entry_time,
      mixing_time,
      water_consume,
      dicromate,
      // ph_booster,
      // nts_clate,
      hardener_qty,
      remark
    } = req.body;

    const today = new Date();
    const formattedDate = today.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

    const requiredMaterials = {
      cement: parseFloat(cement_qty || 0),
      lime: parseFloat(lime_qty || 0),
      gypsum: parseFloat(gypsum_qty || 0),
      soluble_oil: parseFloat(soluble_oil_qty || 0),
      aluminium: parseFloat(aluminium_qty || 0) / 1000,
      mould_oil: parseFloat(mould_oil_qty || 0) / 1000,
      dicromate: parseFloat(dicromate || 0) / 1000,
      // ph_booster: parseFloat(ph_booster || 0),
      // nts_clate:parseFloat(nts_clate || 0),
      hardner: parseFloat(hardener_qty || 0)
    };

    const allMaterials = await Material.findAll();

    // ✅ Step 1: Calculate total available for each material field
    const materialTotals = {};
    for (const mat of Object.keys(requiredMaterials)) {
      materialTotals[mat] = allMaterials.reduce((sum, row) => {
        return sum + parseFloat(row[mat] || 0);
      }, 0);
    }

    // ✅ Step 2: Check for availability
    for (const [mat, requiredQty] of Object.entries(requiredMaterials)) {
      const availableQty = materialTotals[mat] || 0;
      if (requiredQty > 0 && availableQty < requiredQty) {
        return res.status(400).json({
          error: `Material ${mat} is insufficient — required: ${requiredQty}, available: ${availableQty}.`
        });
      }
    }

    // ✅ Step 3: Deduct from rows (FIFO)
    for (const [mat, requiredQty] of Object.entries(requiredMaterials)) {
      if (requiredQty <= 0) continue;

      let remaining = requiredQty;

      const rows = allMaterials
        .filter((row) => parseFloat(row[mat] || 0) > 0)
        .sort((a, b) => a.id - b.id);

      for (const row of rows) {
        if (remaining <= 0) break;

        const available = parseFloat(row[mat] || 0);
        const deduct = Math.min(available, remaining);

        row[mat] = available - deduct;
        remaining -= deduct;

        await row.save();
      }
    }

    const now = new Date();
    const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const entry_times = now.toTimeString().split(" ")[0];
    // ✅ Step 4: Create Batching Entry
    const batching = await Batching.create({
      user_id,
      batch_date: formattedDate,
      shift,
      operator_name,
      mould_no,
      slurry_waste,
      slurry_fresh,
      cement_qty,
      lime_qty,
      gypsum_qty,
      soluble_oil_qty,
      aluminium_qty,
      mould_oil_qty,
      density,
      flow_value,
      temperature,
      entry_time,
      hardener_qty,
      mixing_time,
      water_consume,
      dicromate,
      remark
    });

    // HH:mm:ss
    const user = await AuthModel.findByPk(user_id);
    const username = user ? user?.name : "Unknown User";
    const logMessage = `Batching  mould number ${batching?.mould_no}  was created by ${username} on ${entry_date} at ${entry_times}.`;
    await createLogEntry({
      user_id,
      message: logMessage
    });

    return res.status(201).json({
      message: "Batching created successfully.",
      data: batching
    });
  } catch (error) {
    console.error("Create Batching Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.getBatchingDatewise = async (req, res) => {
  try {
    const batchings = await Batching.findAll({
      attributes: [
        [fn("DATE", col("batch_date")), "batch_date"],
        [fn("COUNT", col("id")), "total_records"],
        [fn("MIN", col("id")), "sample_id"] // 👈 ek id return hogi
      ],
      where: { deleted_at: null },
      group: [fn("DATE", col("batch_date"))],
      order: [[literal("batch_date"), "DESC"]]
    });

    res.status(200).json(batchings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBatching = async (req, res) => {
  try {
    const { id } = req.params;

    // First get the record by id
    const data = await Batching.findOne({ where: { id } });
    if (!data) {
      return res.status(404).json({ message: "Batching not found" });
    }

    // Extract only date part
    const date = data.batch_date;

    // Get all records of same date (ignoring time)
    const batchings = await Batching.findAll({
      where: where(fn("DATE", col("batch_date")), date)
    });

    res.status(200).json(batchings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllBatching = async (req, res) => {
  try {
    const batchings = await Batching.findAll({
      where: {
        deleted_at: null // Only non-deleted Rising entries
      }
    });

    res.status(200).json(batchings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBatching = async (req, res) => {
  try {
    const {
      id,
      user_id,
      shift,
      operator_name,
      mould_no,
      slurry_waste,
      slurry_fresh,
      cement_qty,
      lime_qty,
      gypsum_qty,
      soluble_oil_qty,
      aluminium_qty,
      mould_oil_qty,
      density,
      flow_value,
      temperature,
      entry_time,
      hardener_qty,
      mixing_time,
      water_consume,
      dicromate,
      remark
    } = req.body;

    const batching = await Batching.findByPk(id);
    if (!batching) {
      return res.status(404).json({ error: "Batching entry not found." });
    }

    // Step 1: Unit-adjusted new values (convert to same units as Material table)
    const newMaterials = {
      cement: parseFloat(cement_qty || 0),
      lime: parseFloat(lime_qty || 0),
      gypsum: parseFloat(gypsum_qty || 0),
      soluble_oil: parseFloat(soluble_oil_qty || 0),
      aluminium: parseFloat(aluminium_qty || 0) / 1000, // gm → kg
      mould_oil: parseFloat(mould_oil_qty || 0) / 1000, // ml → liter
      dicromate: parseFloat(dicromate || 0) / 1000, // gm → kg
      hardner: parseFloat(hardener_qty || 0)
    };

    // Step 2: Old values (unit-adjusted)
    const oldMaterials = {
      cement: parseFloat(batching.cement_qty || 0),
      lime: parseFloat(batching.lime_qty || 0),
      gypsum: parseFloat(batching.gypsum_qty || 0),
      soluble_oil: parseFloat(batching.soluble_oil_qty || 0),
      aluminium: parseFloat(batching.aluminium_qty || 0) / 1000,
      mould_oil: parseFloat(batching.mould_oil_qty || 0) / 1000,
      dicromate: parseFloat(batching.dicromate || 0) / 1000,
      hardner: parseFloat(batching.hardener_qty || 0)
    };

    // Step 3: Calculate difference (new - old)
    const diffMaterials = {};
    for (const key in newMaterials) {
      const diff = newMaterials[key] - oldMaterials[key];
      if (diff !== 0) {
        diffMaterials[key] = diff;
      }
    }

    const allMaterials = await Material.findAll();

    // Step 4: Check and apply material updates
    for (const [mat, diffQty] of Object.entries(diffMaterials)) {
      if (diffQty > 0) {
        // Need to deduct extra
        const totalAvailable = allMaterials.reduce(
          (sum, row) => sum + parseFloat(row[mat] || 0),
          0
        );
        if (totalAvailable < diffQty) {
          return res.status(400).json({
            error: `Material ${mat} is insufficient — required: ${diffQty}, available: ${totalAvailable}.`
          });
        }

        let remaining = diffQty;
        const rows = allMaterials
          .filter((row) => parseFloat(row[mat] || 0) > 0)
          .sort((a, b) => a.id - b.id); // FIFO

        for (const row of rows) {
          if (remaining <= 0) break;

          const available = parseFloat(row[mat] || 0);
          const deduct = Math.min(available, remaining);

          row[mat] = available - deduct;
          remaining -= deduct;

          await row.save();
        }
      } else if (diffQty < 0) {
        // Need to add back the unused material
        let remaining = Math.abs(diffQty);
        const rows = allMaterials.sort((a, b) => a.id - b.id); // FIFO

        for (const row of rows) {
          row[mat] = parseFloat(row[mat] || 0) + remaining;
          await row.save();
          break; // Add to first row only
        }
      }
    }

    // Step 5: Update batching
    await batching.update({
      user_id,
      shift,
      operator_name,
      mould_no,
      slurry_waste,
      slurry_fresh,
      cement_qty,
      lime_qty,
      gypsum_qty,
      soluble_oil_qty,
      aluminium_qty,
      mould_oil_qty,
      density,
      flow_value,
      temperature,
      entry_time,
      hardener_qty,
      mixing_time,
      water_consume,
      dicromate,
      remark
    });

    // Step 6: Logging
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_times = now.toTimeString().split(" ")[0];
    const user = await AuthModel.findByPk(user_id);
    const username = user ? user.name : "Unknown User";

    const logMessage = `Batching entry (mould no: ${batching.mould_no}) was updated by ${username} on ${entry_date} at ${entry_times}.`;

    await createLogEntry({
      user_id,
      message: logMessage
    });

    return res.status(200).json({
      message: "Batching updated successfully.",
      data: batching
    });
  } catch (error) {
    console.error("Update Batching Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteBatching = async (req, res) => {
  try {
    const batching = await Batching.findByPk(req.params.id);
    if (!batching) {
      return res.status(404).json({ message: "Batch entry not found" });
    }

    const user_id = batching?.user_id;
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
    const user = await AuthModel.findByPk(user_id);
    const username = user ? user?.name : "Unknown User";
    const logMessage = `Batching  mould number ${batching?.mould_no}  was deleted by ${username} on ${entry_date} at ${entry_time}.`;
    await createLogEntry({
      user_id,
      message: logMessage
    });
    await batching.destroy();

    res.status(200).json({ message: "Batch entry deleted successfully" });
  } catch (error) {
    console.error("Delete Batching Error:", error);
    res.status(500).json({ error: error.message });
  }
};
