const { DataTypes } = require("sequelize");
const { sequelize } = require("../index");

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
      type: DataTypes.JSON
    },
    quantity: {
      type: DataTypes.JSON
    },
    unit: {
      type: DataTypes.JSON
    },
    size: {
      type: DataTypes.JSON
    },
    give_range:{
       type: DataTypes.STRING
    },
    delivery_address:{
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
