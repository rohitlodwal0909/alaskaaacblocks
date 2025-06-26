const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Notification = sequelize.define("notifications", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  message: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_read: {
    type: DataTypes.STRING,
    allowNull: true
  },
   date_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
},{
    tableName: "notifications",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});

module.exports = Notification;