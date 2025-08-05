const { createLogEntry } = require("../../helper/createLogEntry");
const db = require("../../models");
const { Segregation, Dispatch ,AuthModel} = db;

// CREATE Dispatch entry
exports.createDispatch = async (req, res) => {
  try {
    const {
      user_id,
      vehicle_number,
      transport_name,
      driver_name,
      driver_number,
      delivery_area,
      invoice_number,
      eway_bill_number,
      material_details,
      quantity,
      size,
      loading_picture,
      quality_check,
      person_responsible,
      time,
      eway_bill_expiry,
    } = req.body;
   
    const profileImageFile = req.file;
    const profileImagePath = profileImageFile ? `/uploads/${profileImageFile.filename}`:null 
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD
    const dispatchEntry = await Dispatch.create({
      user_id,
      vehicle_number,
      transport_name,
      driver_name,
      driver_number,
      delivery_area,
      invoice_number,
      eway_bill_number,
      material_details,
      quantity,
      size,
      loading_picture:profileImagePath,
      quality_check,
      person_responsible,
      time,
      eway_bill_expiry,
      date: formattedDate, // backend inserts current date
    });

    // Optional Logging
    const entryTime = currentDate.toTimeString().split(" ")[0]; // HH:mm:ss

    const user = await AuthModel.findByPk(user_id);
    const username = user ? user.name : "Unknown User";

    const logMessage = `Dispatch for vehicle ${vehicle_number} was created by ${username} on ${formattedDate} at ${entryTime}.`;

    await createLogEntry({
      user_id,
      message: logMessage,
    });

    res.status(201).json({
      message: "Dispatch entry created successfully",
      data: dispatchEntry,
    });
  } catch (error) {
    console.error("Create Dispatch Error:", error);
    res.status(500).json({ error: error.message });
  }
};
// GET all Cutting entries with related Dispatch
exports.getAllDispatch = async (req, res) => {
  try {
    const data = await Dispatch.findAll({
      where: {}, // optionally add filters here
      order: [['created_at', 'DESC']], // optional: latest first
    });

    res.status(200).json({
      message: "All dispatch entries fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Get All Dispatch Error:", error);
    res.status(500).json({ error: error.message });
  }
};



// Read By ID
exports.getDispatchById = async (req, res) => {
  
  try {
    const Dispatch = await Dispatch.findByPk(req.params.id);
    if (!Dispatch)
      return res.status(404).json({ message: "Dispatch entry not found" });

    res.json(Dispatch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
exports.updateDispatch = async (req, res) => {
  try {
    const dispatchEntry = await Dispatch.findByPk(req.params.id);
    if (!dispatchEntry) {
      return res.status(404).json({ message: "Dispatch entry not found" });
    }
       
    const profileImageFile = req.file;
    const profileImagePath = profileImageFile ? `/uploads/${profileImageFile.filename}`:null 
    await dispatchEntry.update({
      vehicle_number: req.body.vehicle_number,
      transport_name: req.body.transport_name,
      driver_name: req.body.driver_name,
      driver_number: req.body.driver_number,
      delivery_area: req.body.delivery_area,
      invoice_number: req.body.invoice_number,
      eway_bill_number: req.body.eway_bill_number,
      material_details: req.body.material_details,
      quantity: req.body.quantity,
      size: req.body.size,
      loading_picture:  req.body.loading_picture || profileImagePath ,
      quality_check: req.body.quality_check,
      person_responsible: req.body.person_responsible,
      time: req.body.time,
      eway_bill_expiry: req.body.eway_bill_expiry,
    });

    // 🔐 Logging
    const user_id = req.body.user_id;
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];

    const user = await AuthModel.findByPk(user_id);
    const username = user ? user.name : "Unknown User";

    const logMessage = `Dispatch for vehicle number ${dispatchEntry.vehicle_number} was updated by ${username} on ${entry_date} at ${entry_time}.`;

    await createLogEntry({
      user_id,
      message: logMessage,
    });

    res.json({
      message: "Dispatch entry updated successfully",
      data: dispatchEntry,
    });
  } catch (error) {
    console.error("Update Dispatch Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE (soft delete)
exports.deleteDispatch = async (req, res) => {
  try {
    const segEntry = await Dispatch.findByPk(req.params.id);
    if (!segEntry) {
      return res.status(404).json({ message: "Dispatch entry not found" });
    }
        const user_id = segEntry?.user_id;
           const now = new Date();
          const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
          const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
        const user = await AuthModel.findByPk(user_id);
        const username = user ? user?.name : "Unknown User";
        const logMessage = `Dispatch for vehicle number ${segEntry.vehicle_number} was deleted by ${username} on ${entry_date} at ${entry_time}.`;
        await createLogEntry({
          user_id,
          message:logMessage
        });
    await segEntry.destroy(); // soft delete (paranoid: true)
    res.json({ message: "Dispatch entry deleted successfully" });
  } catch (error) {
    console.error("Delete Dispatch Error:", error);
    res.status(500).json({ error: error.message });
  }
};