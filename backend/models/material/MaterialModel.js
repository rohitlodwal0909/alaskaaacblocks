// models/Material.js
module.exports = (sequelize, DataTypes) => {
  const Material = sequelize.define(
    "Material",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
       user_id: {
        type: DataTypes.INTEGER,
      },
      receiving_id:{
       type: DataTypes.INTEGER,
      },
      mould_oil: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      slurry_waste: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      slurry_fresh: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      cement: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      lime: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      gypsum: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      soluble_oil: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      aluminium: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      density: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      flow_value: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "material",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true, // enables soft delete (deleted_at)
      deletedAt: "deleted_at",
    }
  );
  Material.associate = function (models) {
  Material.belongsTo(models.Receiving, {
    foreignKey: "receiving_id",
    as: "receiving",
  });
};

  return Material;
};
