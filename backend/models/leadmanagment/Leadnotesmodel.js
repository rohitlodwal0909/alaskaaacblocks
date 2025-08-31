const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const LeadNote = sequelize.define(
    "LeadNote",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      notes: { type: DataTypes.STRING, allowNull: true },
      followUpDate: { type: DataTypes.STRING, allowNull: true },
      give_range: { type: DataTypes.JSON, allowNull: true },
      quantity: { type: DataTypes.JSON, allowNull: true },
      size: { type: DataTypes.JSON, allowNull: true },
      lead_id: { type: DataTypes.INTEGER, allowNull: true },
      callType: { type: DataTypes.STRING, allowNull: true }
    },
    {
      tableName: "lead_notes",
      timestamps: false
    }
  );

  // 👇 Define the belongsTo association
  LeadNote.associate = (models) => {
    LeadNote.belongsTo(models.Lead, {
      foreignKey: "lead_id",
      as: "lead"
    });
  };

  return LeadNote;
};
