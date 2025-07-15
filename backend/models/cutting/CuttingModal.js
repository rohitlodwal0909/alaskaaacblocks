module.exports = (sequelize, DataTypes) => {
  const Cutting = sequelize.define(
    "Cutting",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      mould_no: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      operator_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      size: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      broken_pcs: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      remark: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "cutting",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      paranoid: true,           // enables soft deletes
      underscored: true,        // uses snake_case column names
    }
  );


 Cutting.associate = (models) => {
  Cutting.belongsTo(models.Rising, {
    foreignKey: "mould_no",
    targetKey: "mould_no",
    as: "rising_info", // 👈 because this is pointing to Rising
  });
  Cutting.hasMany(models.Autoclave, {
  foreignKey: "mould_no",
  sourceKey: "mould_no",
  as: "autoclave_entries",
});
};

 return Cutting;
};
