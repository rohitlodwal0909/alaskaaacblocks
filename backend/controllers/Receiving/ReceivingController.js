const { createLogEntry } = require("../../helper/createLogEntry");
const db = require("../../models");
const {  Receiving ,AuthModel,Material} = db;

// CREATE Receiving entry
exports.createReceiving = async (req, res) => {
  try {
    const {
      date,
      supplier_name,
      invoice_no,
      received_by,
      material_details,
      user_id,
    } = req.body;
    // Create Receiving Stock Entry
    const receivingEntry = await Receiving.create({
      date,
      supplier_name,
      invoice_no,
      received_by,
      material_details,
      user_id,
    });

    // Logging (optional)
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss

    let username = "Unknown User";
    if (user_id) {
      const user = await AuthModel.findByPk(user_id);
      username = user ? user.name : "Unknown User";
    }

    const logMessage = `Receiving stock entry created by ${username} on ${entry_date} at ${entry_time}.`;

    await createLogEntry({
      user_id,
      message: logMessage,
    });

    res.status(201).json({
      message: "Receiving stock entry created successfully",
      data: receivingEntry,
    });

  } catch (error) {
    console.error("Create ReceivingStock Error:", error);
    res.status(500).json({ error: error.message });
  }
};
// GET all Cutting entries with related Receiving
exports.getAllReceiving = async (req, res) => {
  try {
    const data = await Receiving.findAll({
      where: {}, // Add filters if needed
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Material,
          as: "materials", // 👈 Must match alias in Receiving.associate
        },
      ],
    });

    res.status(200).json({
      message: "All Receiving entries with materials fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Get All Receiving Error:", error);
    res.status(500).json({ error: error.message });
  }
};



// Read By ID
exports.getReceivingById = async (req, res) => {
  
  try {
    const Receiving = await Receiving.findByPk(req.params.id);
    if (!Receiving)
      return res.status(404).json({ message: "Receiving entry not found" });

    res.json(Receiving);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
exports.updateReceiving = async (req, res) => {
  try {
    const receivingEntry = await Receiving.findByPk(req.params.id);
    if (!receivingEntry) {
      return res.status(404).json({ message: "Receiving stock entry not found" });
    }

    await receivingEntry.update({
      date: req.body.date,
      supplier_name: req.body.supplier_name,
      invoice_no: req.body.invoice_no,
      received_by: req.body.received_by,
      material_details: req.body.material_details,
    });

    // 🔐 Logging
    const user_id = req.body.user_id;
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];

    const user = await AuthModel.findByPk(user_id);
    const username = user ? user.name : "Unknown User";

    const logMessage = `Receiving stock entry (ID: ${receivingEntry.id}) was updated by ${username} on ${entry_date} at ${entry_time}.`;

    await createLogEntry({
      user_id,
      message: logMessage,
    });

    res.json({
      message: "Receiving stock entry updated successfully",
      data: receivingEntry,
    });

  } catch (error) {
    console.error("Update ReceivingStock Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE (soft delete)
exports.deleteReceiving = async (req, res) => {
  try {
    const segEntry = await Receiving.findByPk(req.params.id);
    if (!segEntry) {
      return res.status(404).json({ message: "Receiving entry not found" });
    }
        const user_id = segEntry?.user_id;
           const now = new Date();
          const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
          const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
        const user = await AuthModel.findByPk(user_id);
        const username = user ? user?.name : "Unknown User";
        const logMessage = `Receiving for vehicle number ${segEntry.vehicle_number} was deleted by ${username} on ${entry_date} at ${entry_time}.`;
        await createLogEntry({
          user_id,
          message:logMessage
        });
    await segEntry.destroy(); // soft delete (paranoid: true)
    res.json({ message: "Receiving entry deleted successfully" });
  } catch (error) {
    console.error("Delete Receiving Error:", error);
    res.status(500).json({ error: error.message });
  }
};