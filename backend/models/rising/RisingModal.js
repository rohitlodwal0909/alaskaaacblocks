module.exports = (sequelize, DataTypes) => {
  const Rising = sequelize.define(
    "Rising",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
       user_id: {
        type: DataTypes.INTEGER,
       
      },
      mould_no: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      hardness: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      temperature: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      rising_time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rising_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      operator_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      remark: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "rising",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      paranoid: true,
      underscored: true,
    }
  );

 Rising.associate = (models) => {
  Rising.belongsTo(models.Batching, {
    foreignKey: "mould_no",
    targetKey: "mould_no",
    as: "batching_info",
  });

 Rising.hasOne(models.Cutting, {
  foreignKey: "mould_no",
  sourceKey: "mould_no",
  as: "cutting_info",
});
};

  return Rising;
};
