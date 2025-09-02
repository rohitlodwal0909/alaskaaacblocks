module.exports = (sequelize, DataTypes) => {
  const Autoclave = sequelize.define(
    "Autoclave",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER
      },
      cutting_id: {
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
      datetime: {
        type: DataTypes.STRING,
        allowNull: false
      },

      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      tableName: "autoclave",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      paranoid: true,
      underscored: true
    }
  );
  // Association: Autoclave belongs to Cutting via mould_no
  Autoclave.associate = (models) => {
    Autoclave.belongsTo(models.Cutting, {
      foreignKey: "cutting_id",
      targetKey: "id",
      as: "cutting_info"
    });

    Autoclave.hasOne(models.Segregation, {
      foreignKey: "autoclave_id",
      sourceKey: "id",
      as: "segregation"
    });

    Autoclave.hasMany(models.AutoclaveRecord, {
      foreignKey: "autoclave_id", // 👈 joins with Autoclave.id
      sourceKey: "id", // 👈 explicitly map to Autoclave.id
      as: "records"
    });
  };

  return Autoclave;
};
