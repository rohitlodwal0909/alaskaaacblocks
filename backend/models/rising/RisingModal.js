module.exports = (sequelize, DataTypes) => {
  const Rising = sequelize.define(
    "Rising",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER
      },
      batching_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      hardness: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      temperature: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      rising_time: {
        type: DataTypes.STRING,
        allowNull: false
      },
      rising_date: {
        type: DataTypes.STRING,
        allowNull: true
      },
      operator_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      remark: {
        type: DataTypes.STRING,
        allowNull: true
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      tableName: "rising",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      paranoid: true,
      underscored: true
    }
  );

  Rising.associate = (models) => {
    Rising.belongsTo(models.Batching, {
      foreignKey: "batching_id",
      targetKey: "id",
      as: "batching_info"
    });
    Rising.hasOne(models.Cutting, {
      foreignKey: "rising_id",
      targetKey: "id",
      as: "cutting_info"
    });
  };

  return Rising;
};
