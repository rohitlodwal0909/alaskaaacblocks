module.exports = (sequelize, DataTypes) => {
  const Segregation = sequelize.define(
    "Segregation",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER
      },

      size: {
        type: DataTypes.JSON
      },
      no_of_broken_pcs: {
        type: DataTypes.JSON
      },
      no_of_ok_pcs: {
        type: DataTypes.JSON
      },
      plate_no: {
        type: DataTypes.JSON
      },
      remark: {
        type: DataTypes.TEXT
      },
      operator_name: {
        type: DataTypes.STRING
      },
      date: {
        type: DataTypes.DATEONLY
      },
      deleted_at: {
        type: DataTypes.DATE
      }
    },
    {
      tableName: "segregation",
      underscored: true,
      timestamps: true,
      paranoid: true, // Enables soft delete using deleted_at
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at"
    }
  );

  return Segregation;
};
