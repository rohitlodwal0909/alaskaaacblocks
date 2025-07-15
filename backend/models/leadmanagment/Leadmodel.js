const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Lead = sequelize.define(
    "Lead",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING },
      phone: { type: DataTypes.STRING },
      date: { type: DataTypes.DATE },
      source: { type: DataTypes.STRING },
      material: { type: DataTypes.JSON },
      quantity: { type: DataTypes.JSON },
      unit: { type: DataTypes.JSON },
      size: { type: DataTypes.JSON },
      give_range: { type: DataTypes.JSON },
      delivery_address: { type: DataTypes.STRING },
      state: { type: DataTypes.STRING },
      district: { type: DataTypes.STRING },
      tehsil: { type: DataTypes.STRING },
      address: { type: DataTypes.TEXT },
      datetime: { type: DataTypes.DATE },
      status: {
        type: DataTypes.ENUM("New", "Contacted", "Interested", "Converted", "Lost"),
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

  Lead.associate = (models) => {
    Lead.hasMany(models.LeadNote, {
      foreignKey: "lead_id",
    as: "notes"
    
    });
  };

  return Lead;
};
