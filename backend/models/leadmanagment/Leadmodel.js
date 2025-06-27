const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Lead = sequelize.define(
  "leads",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.STRING
    },
    date: {
      type: DataTypes.DATE
    },
    source: {
      type: DataTypes.STRING
    },
    material: {
      type: DataTypes.STRING
    },
    quantity: {
      type: DataTypes.STRING
    },
    unit: {
      type: DataTypes.STRING
    },
    size: {
      type: DataTypes.STRING
    },
    state: {
      type: DataTypes.STRING
    },
    district: {
      type: DataTypes.STRING
    },
    tehsil: {
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.TEXT
    },
    status: {
      type: DataTypes.ENUM(
        "New",
        "Contacted",
        "Interested",
        "Converted",
        "Lost"
      ),
      defaultValue: "New"
    }
  },
  {
    tableName: "leads",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    paranoid: true,
    deletedAt: "deleted_at",
    underscored: true
  }
);

module.exports = Lead;
