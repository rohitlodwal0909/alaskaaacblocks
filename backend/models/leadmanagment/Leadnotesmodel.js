const { DataTypes } = require("sequelize");
const { sequelize } = require("../index");

const LeadNote = sequelize.define("lead_notes", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  notes: {
    type: DataTypes.STRING,
    allowNull: true
  },
  followUpDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  give_range:{
     type: DataTypes.STRING,
    allowNull: true
  },
  lead_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  callType: {
    type: DataTypes.STRING,
    allowNull: true
  }
},{
  timestamps: false });

module.exports = LeadNote;
