const db = require('../../models');
const { Batching ,Rising }= db

exports.createBatching = async (req, res) => {
  try {
    const today = new Date();
    const formatted = today.toLocaleString('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

    const batching = await Batching.create({
      ...req.body,
    batch_date:formatted
    });
    res.status(201).json(batching);
  } catch (error) {
    console.error("Create Lead Error:", error);
    res.status(500).json({ error: error.message });
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


exports.updateBatching = async (req, res) => {
  try {
    const batching = await Batching.findByPk(req.params.id);
    if (!batching) {
      return res.status(404).json({ message: "Batch entry not found" });
    }

    await batching.update({ ...req.body });

    res.status(200).json(batching);
  } catch (error) {
    console.error("Update Batching Error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteBatching = async (req, res) => {
  try {
    const batching = await Batching.findByPk(req.params.id);
    if (!batching) {
      return res.status(404).json({ message: "Batch entry not found" });
    }

    await batching.destroy(); 

    res.status(200).json({ message: "Batch entry deleted successfully" });
  } catch (error) {
    console.error("Delete Batching Error:", error);
    res.status(500).json({ error: error.message });
  }
};