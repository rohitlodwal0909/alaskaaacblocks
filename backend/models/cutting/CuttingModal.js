module.exports = (sequelize, DataTypes) => {
  const Cutting = sequelize.define(
    "Cutting",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER
      },
      rising_id: {
        type: DataTypes.INTEGER
      },
      mould_no: {
        type: DataTypes.STRING,
        allowNull: false
      },
      operator_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      size: {
        type: DataTypes.JSON,
        allowNull: false
      },
      broken_pcs: {
        type: DataTypes.JSON,
        allowNull: false
      },
      middle_crack: {
        type: DataTypes.JSON,
        allowNull: false
      },
      ok_pcs: {
        type: DataTypes.JSON,
        allowNull: false
      },
      datetime: {
        type: DataTypes.STRING,
        allowNull: false
      },
      time: {
        type: DataTypes.TIME,
        allowNull: false
      },
      remark: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      tableName: "cutting",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      paranoid: true, // enables soft deletes
      underscored: true // uses snake_case column names
    }
  );

  Cutting.associate = (models) => {
    Cutting.belongsTo(models.Rising, {
      foreignKey: "rising_id",
      sourceKey: "id",
      as: "rising"
    });
    Cutting.hasOne(models.Autoclave, {
      foreignKey: "cutting_id",
      sourceKey: "id",
      as: "autoclave"
    });
  };

  return Cutting;
};
