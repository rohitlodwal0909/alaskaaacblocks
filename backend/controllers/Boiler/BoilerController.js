const { createLogEntry } = require("../../helper/createLogEntry");
const db = require("../../models");
const { Autoclave, Boiler ,AuthModel} = db;

// CREATE Boiler entry
exports.createBoiler = async (req, res) => {
  try {
    const {
      user_id,
      date,
      location,
      shift,
      done_by,
      total_wood_consumption,
      readings = [],
    } = req.body;

    // Combine all reading values column-wise
    const combinedReadings = {
      time: [],
      feed_water_temp: [],
      feed_water_tds: [],
      water_meter_reading: [],
      steam_pressure: [],
      stack_temp: [],
      inlet_temp: [],
      fd_fan_reading: [],
      wood_consumption: [],
      chemical_consumption: [],
      energy_meter_reading: [],
    };

    readings.forEach((reading) => {
      combinedReadings.time.push(reading.time || null);
      combinedReadings.feed_water_temp.push(reading.feed_water_temp || null);
      combinedReadings.feed_water_tds.push(reading.feed_water_tds || null);
      combinedReadings.water_meter_reading.push(reading.water_meter_reading || null);
      combinedReadings.steam_pressure.push(reading.steam_pressure || null);
      combinedReadings.stack_temp.push(reading.stack_temp || null);
      combinedReadings.inlet_temp.push(reading.inlet_temp || null);
      combinedReadings.fd_fan_reading.push(reading.fd_fan_reading || null);
      combinedReadings.wood_consumption.push(reading.wood_consumption || null);
      combinedReadings.chemical_consumption.push(reading.chemical_consumption || null);
      combinedReadings.energy_meter_reading.push(reading.energy_meter_reading || null);
    });

    const newEntry = await Boiler.create({
      user_id,
      date,
      location,
      shift,
      done_by,
      total_wood_consumption,

      // readings column-wise as JSON
      time: combinedReadings.time,
      feed_water_temp: combinedReadings.feed_water_temp,
      feed_water_tds: combinedReadings.feed_water_tds,
      water_meter_reading: combinedReadings.water_meter_reading,
      steam_pressure: combinedReadings.steam_pressure,
      stack_temp: combinedReadings.stack_temp,
      inlet_temp: combinedReadings.inlet_temp,
      fd_fan_reading: combinedReadings.fd_fan_reading,
      wood_consumption: combinedReadings.wood_consumption,
      chemical_consumption: combinedReadings.chemical_consumption,
      energy_meter_reading: combinedReadings.energy_meter_reading,
    });

    // Logging
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];

    const user = await AuthModel.findByPk(user_id);
    const username = user ? user.name : "Unknown User";

    const logMessage = `Boiler id ${newEntry?.id} was created by ${username} on ${entry_date} at ${entry_time}.`;

    await createLogEntry({
      user_id,
      message: logMessage,
    });

    res.status(201).json({
      message: "Boiler entry created successfully",
      data: newEntry,
    });
  } catch (err) {
    console.error("Error creating boiler entry:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET all Cutting entries with related Boiler
exports.getAllBoiler = async (req, res) => {
  try {
    const data = await Boiler.findAll();

    res.json(data);
  } catch (error) {
    console.error("Get All Boiler Error:", error);
    res.status(500).json({ error: error.message });
  }
};



// Read By ID
exports.getBoilerById = async (req, res) => {
  
  try {
    const boiler = await Boiler.findByPk(req.params.id);
    if (!boiler)
      return res.status(404).json({ message: "Boiler entry not found" });

    res.json(boiler);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
exports.updateBoiler = async (req, res) => {
  try {
    const boilerId = req.params.id;

    // 1. Find existing record
    const existingBoiler = await Boiler.findByPk(boilerId);
    if (!existingBoiler) {
      return res.status(404).json({ message: "Boiler entry not found" });
    }
    // 2. Destructure metadata + readings from body
    const { readings = [], user_id, done_by, shift, date , total_wood_consumption} = req.body;
    
 
    // 3. Map each reading field (as arrays)
    const time = readings.map((r) => r.time);
    const feed_water_temp = readings.map((r) => r.feed_water_temp);
    const feed_water_tds = readings.map((r) => r.feed_water_tds);
    const water_meter_reading = readings.map((r) => r.water_meter_reading);
  
    const steam_pressure = readings.map((r) => r.steam_pressure);
    const stack_temp = readings.map((r) => r.stack_temp);
    const inlet_temp = readings.map((r) => r.inlet_temp);
 
    const fd_fan_reading = readings.map((r) => r.fd_fan_reading);
    const wood_consumption = readings.map((r) => r.wood_consumption);
 
    const chemical_consumption = readings.map((r) => r.chemical_consumption);
    const energy_meter_reading = readings.map((r) => r.energy_meter_reading);

    // 4. Update all fields
    await existingBoiler.update({
      user_id,
      time,
      feed_water_temp,
      feed_water_tds,
      water_meter_reading,
      steam_pressure,
      stack_temp,
      inlet_temp,
      fd_fan_reading,
      wood_consumption,
      chemical_consumption,
      energy_meter_reading,
      done_by,
      shift,
      total_wood_consumption,
      date,
    });

    // 5. Logging
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];

    const user = await AuthModel.findByPk(user_id);
    const username = user ? user.name : "Unknown User";

    const logMessage = `Boiler id ${boilerId} was updated by ${username} on ${entry_date} at ${entry_time}.`;

    await createLogEntry({
      user_id,
      message: logMessage,
    });

    // 6. Response
    res.json({
      message: "Boiler entry updated successfully",
      data: existingBoiler,
    });

  } catch (error) {
    console.error("Update Boiler Error:", error);
    res.status(500).json({ error: error.message });
  }
};


// DELETE (soft delete)
exports.deleteBoiler = async (req, res) => {
  try {
    const segEntry = await Boiler.findByPk(req.params.id);
    if (!segEntry) {
      return res.status(404).json({ message: "Boiler entry not found" });
    }
    const user_id = segEntry?.user_id;
           const now = new Date();
          const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
          const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
        const user = await AuthModel.findByPk(user_id);
        const username = user ? user?.name : "Unknown User";
        const logMessage = `Boiler id ${segEntry?.id}  was deleted by ${username} on ${entry_date} at ${entry_time}.`;
        await createLogEntry({
          user_id,
          message:logMessage
        });
    await segEntry.destroy(); // soft delete (paranoid: true)
    res.json({ message: "Boiler entry deleted successfully" });
  } catch (error) {
    console.error("Delete Boiler Error:", error);
    res.status(500).json({ error: error.message });
  }
};