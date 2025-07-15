module.exports = (sequelize, DataTypes) => {
  const Segregation = sequelize.define(
    "Segregation",
    {
       id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      mould_no: {
        type: DataTypes.STRING,
      },
      size: {
        type: DataTypes.STRING,
      },
      no_of_broken_pcs: {
        type: DataTypes.INTEGER,
      },
      no_of_ok_pcs: {
        type: DataTypes.INTEGER,
      },
      remark: {
        type: DataTypes.TEXT,
      },
      operator_name: {
        type: DataTypes.STRING,
      },
      date: {
        type: DataTypes.DATEONLY,
      },
      deleted_at: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "segregation",
      underscored: true,
      timestamps: true,
      paranoid: true, // Enables soft delete using deleted_at
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  Segregation.associate = function (models) {
    Segregation.belongsTo(models.Autoclave, {
      foreignKey: "mould_no",
      targetKey: "mould_no",
      as: "autoclave",
    });
  };

  return Segregation;
};
