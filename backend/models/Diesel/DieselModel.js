  module.exports = (sequelize, DataTypes) => {
  const Diesel = sequelize.define("Diesel", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id:{
       type: DataTypes.INTEGER,
    },
    fuel_consume: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    meter_reading: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: "diesel_fuel",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    paranoid: true, // enables soft delete (deletedAt)
    deletedAt: "deleted_at",
  });
  return Diesel;
};
