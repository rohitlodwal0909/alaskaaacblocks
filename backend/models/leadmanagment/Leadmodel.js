const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Lead = sequelize.define(
  "leads", // Model name
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    source: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM(
        "New",
        "Contacted",
        "Interested",
        "Converted",
        "Lost"
      ),
      defaultValue: "New",
    },
    assigned_to: {
      type: DataTypes.STRING,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "leads",
    timestamps: true, // Automatically creates `createdAt` and `updatedAt`
    createdAt: "created_at",
    updatedAt: "updated_at",
    paranoid: true, // Enables soft delete
    deletedAt: "deleted_at", // Custom name for soft delete field
    underscored: true, // Converts camelCase fields to snake_case in DB
  }
);

module.exports = Lead;
