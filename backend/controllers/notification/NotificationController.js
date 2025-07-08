
const db = require('../../models');
const {Notification}= db
exports.getAllNotification = async (req, res) => {
  try {
    const notification = await Notification.findAll();
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.readNotification = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });

    notification.is_read = 1;
    await notification.save();

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};