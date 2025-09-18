module.exports = (sequelize, DataTypes) => {
  const FinishGood = sequelize.define(
    "FinishGood",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      seg_id: {
        type: DataTypes.INTEGER
      },
      size: {
        type: DataTypes.JSON
      },
      no_of_ok_pcs: {
        type: DataTypes.JSON
      },
      deleted_at: {
        type: DataTypes.DATE
      }
    },
    {
      tableName: "finishgood",
      underscored: true,
      timestamps: true,
      paranoid: true, // Enables soft delete using deleted_at
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at"
    }
  );

  return FinishGood;
};
