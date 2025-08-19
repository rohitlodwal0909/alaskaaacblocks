const { createLogEntry } = require("../../helper/createLogEntry");
const db = require("../../models");
const { Diesel ,AuthModel} = db;

exports.createDiesel = async (req, res) => {
  try {
    const { fuel_consume, meter_reading,user_id ,fuel_feel ,time,description} = req.body;

    const now = new Date();
    const newEntry = await Diesel.create({
      user_id,
      fuel_consume,
      meter_reading,
      date:now,
      fuel_feel ,
      time,
       description
    });

    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];

    const user = await AuthModel.findByPk(user_id);
    const username = user ? user.name : "Unknown User";

    const logMessage = `Diesel fuel ${fuel_consume} was created by ${username} on ${entry_date} at ${entry_time}.`;

    await createLogEntry({
      user_id,
      message: logMessage,
    });

    res.status(201).json({
      message: "Diesel fuel entry created successfully",
      data: newEntry,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating entry", error });
  }
};

// GET all Cutting entries with related Diesel
exports.getAllDiesel = async (req, res) => {
  try {
    const data = await Diesel.findAll();

    res.json(data);
  } catch (error) {
    console.error("Get All Diesel Error:", error);
    res.status(500).json({ error: error.message });
  }
};



// Read By ID
exports.getDieselById = async (req, res) => {
  
  try {
    const diesel = await Diesel.findByPk(req.params.id);
    if (!diesel)
      return res.status(404).json({ message: "Diesel entry not found" });

    res.json(diesel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
exports.updateDiesel = async (req, res) => {
  try {
    const DieselId = req.params.id;
  const { fuel_consume, meter_reading ,user_id, fuel_feel ,time ,description} = req.body;
    // 1. Find existing record
    const existingDiesel = await Diesel.findByPk(DieselId);
    if (!existingDiesel) {
      return res.status(404).json({ message: "Diesel entry not found" });
    }
    // 2. Destructure metadata + readings from body
      // 4. Update all fields
    await existingDiesel.update({ fuel_consume, meter_reading ,fuel_feel , time,description});

    // 5. Logging
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];

    const user = await AuthModel.findByPk(user_id);
    const username = user ? user.name : "Unknown User";

    const logMessage = `Diesel fuel ${existingDiesel?.fuel_consume} was updated by ${username} on ${entry_date} at ${entry_time}.`;

    await createLogEntry({
      user_id,
      message: logMessage,
    });

    // 6. Response
    res.json({
      message: "Diesel entry updated successfully",
      data: existingDiesel,
    });

  } catch (error) {
    console.error("Update Diesel Error:", error);
    res.status(500).json({ error: error.message });
  }
};


// DELETE (soft delete)
exports.deleteDiesel = async (req, res) => {
  try {
    const segEntry = await Diesel.findByPk(req.params.id);
    if (!segEntry) {
      return res.status(404).json({ message: "Diesel entry not found" });
    }
       const user_id = segEntry?.user_id;
           const now = new Date();
          const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
          const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
        const user = await AuthModel.findByPk(user_id);
        const username = user ? user?.name : "Unknown User";
        const logMessage = `Diesel fuel ${segEntry?.fuel_consume} was deleted by ${username} on ${entry_date} at ${entry_time}.`;
        await createLogEntry({
          user_id,
          message:logMessage
        });
    await segEntry.destroy(); // soft delete (paranoid: true)
    res.json({ message: "Diesel entry deleted successfully" });
  } catch (error) {
    console.error("Delete Diesel Error:", error);
    res.status(500).json({ error: error.message });
  }
};