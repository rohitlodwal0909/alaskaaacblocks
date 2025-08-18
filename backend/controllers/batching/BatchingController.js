const { createLogEntry } = require('../../helper/createLogEntry');
const db = require('../../models');
const { Batching ,Rising ,Material ,AuthModel}= db

// exports.createBatching = async (req, res) => {
//   try {
//     const {user_id ,mould_no}=  req.body
//     const today = new Date();
//     const formatted = today.toLocaleString('en-GB', {
//   day: '2-digit',
//   month: 'short',
//   year: 'numeric',
//   hour: '2-digit',
//   minute: '2-digit',
//   hour12: true,
// });

//     const batching = await Batching.create({
//       ...req.body,
//     batch_date:formatted
//     });


//          const now = new Date();
//       const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
//       const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
//     const user = await AuthModel.findByPk(user_id);
//     const username = user ? user?.name : "Unknown User";
//     const logMessage = `Batching  mould number ${mould_no}  was created by ${username} on ${entry_date} at ${entry_time}.`;
//     await createLogEntry({
//       user_id,
//       message:logMessage
//     });
//     res.status(201).json(batching);
//   } catch (error) {
//     console.error("Create Lead Error:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

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
      disromate,
      hardener_qty,
      remark,
    } = req.body;

    const today = new Date();
    const formattedDate = today.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const requiredMaterials = {
      cement: parseFloat(cement_qty || 0),
      lime: parseFloat(lime_qty || 0),
      gypsum: parseFloat(gypsum_qty || 0),
      soluble_oil: parseFloat(soluble_oil_qty || 0),
      aluminium: parseFloat(aluminium_qty || 0),
      mould_oil: parseFloat(mould_oil_qty || 0),
      // slurry_waste: parseFloat(slurry_waste || 0),
      // slurry_fresh: parseFloat(slurry_fresh || 0),
      // flow_value:parseFloat(flow_value || 0)
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
      disromate,
      remark,
    });

   // HH:mm:ss
    const user = await AuthModel.findByPk(user_id);
    const username = user ? user?.name : "Unknown User";
    const logMessage = `Batching  mould number ${batching?.mould_no}  was created by ${username} on ${entry_date} at ${entry_times}.`;
    await createLogEntry({
      user_id,
      message:logMessage
    });

    return res.status(201).json({
      message: "Batching created successfully.",
      data: batching,
    });
  } catch (error) {
    console.error("Create Batching Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.getAllBatching = async (req, res) => {
 
  try {
 
   const batchings = await Batching.findAll();
 
    res.status(200).json(batchings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// exports.updateBatching = async (req, res) => {
//   try {
//     const batching = await Batching.findByPk(req.params.id);
//     if (!batching) {
//       return res.status(404).json({ message: "Batch entry not found" });
//     }

//     await batching.update({ ...req.body });
//      const user_id = batching?.user_id;
//        const now = new Date();
//       const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
//       const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
//     const user = await AuthModel.findByPk(user_id);
//     const username = user ? user?.name : "Unknown User";
//     const logMessage = `Batching  mould number ${batching?.mould_no}  was updated by ${username} on ${entry_date} at ${entry_time}.`;
//     await createLogEntry({
//       user_id,
//       message:logMessage
//     });
//     res.status(200).json(batching);
//   } catch (error) {
//     console.error("Update Batching Error:", error);
//     res.status(500).json({ error: error.message });
//   }
// };


exports.updateBatching = async (req, res) => {
  try {
    const {
      id, // ID of the batching entry to update
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
      disromate,
      remark,
    } = req.body;

    const batching = await Batching.findByPk(id);
    if (!batching) {
      return res.status(404).json({ error: "Batching entry not found." });
    }

    // ✅ Step 1: Calculate required materials for update
    const requiredMaterials = {
      cement: parseFloat(cement_qty || 0),
      lime: parseFloat(lime_qty || 0),
      gypsum: parseFloat(gypsum_qty || 0),
      soluble_oil: parseFloat(soluble_oil_qty || 0),
      aluminium: parseFloat(aluminium_qty || 0),
      mould_oil: parseFloat(mould_oil_qty || 0),
      // slurry_waste: parseFloat(slurry_waste || 0),
      // slurry_fresh: parseFloat(slurry_fresh || 0),
      // flow_value: parseFloat(flow_value || 0),
    };

    // ✅ Step 2: Fetch total available stock
    const allMaterials = await Material.findAll();
    const materialTotals = {};
    for (const mat of Object.keys(requiredMaterials)) {
      materialTotals[mat] = allMaterials.reduce((sum, row) => {
        return sum + parseFloat(row[mat] || 0);
      }, 0);
    }

    // ✅ Step 3: Check material availability
    for (const [mat, requiredQty] of Object.entries(requiredMaterials)) {
      const availableQty = materialTotals[mat] || 0;
      if (requiredQty > 0 && availableQty < requiredQty) {
        return res.status(400).json({
          error: `Material ${mat} is insufficient — required: ${requiredQty}, available: ${availableQty}.`,
        });
      }
    }

    // ✅ Step 4: Deduct from Material table (FIFO)
    for (const [mat, requiredQty] of Object.entries(requiredMaterials)) {
      if (requiredQty <= 0) continue;

      let remaining = requiredQty;

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
    }

    // ✅ Step 5: Update Batching entry
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
      disromate,
      remark,
    });

    // ✅ Step 6: Log entry
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_times = now.toTimeString().split(" ")[0];
    const user = await AuthModel.findByPk(user_id);
    const username = user ? user.name : "Unknown User";

    const logMessage = `Batching entry mould no: ${batching.mould_no}) was updated by ${username} on ${entry_date} at ${entry_times}.`;

    await createLogEntry({
      user_id,
      message: logMessage,
    });

    return res.status(200).json({
      message: "Batching updated successfully.",
      data: batching,
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
      message:logMessage
    });
    await batching.destroy(); 

    res.status(200).json({ message: "Batch entry deleted successfully" });
  } catch (error) {
    console.error("Delete Batching Error:", error);
    res.status(500).json({ error: error.message });
  }
};