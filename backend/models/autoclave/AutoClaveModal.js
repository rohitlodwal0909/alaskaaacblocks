module.exports = (sequelize, DataTypes) => {
  const Autoclave = sequelize.define(
    "Autoclave",
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
      on_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      door_steam_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      vacuum_steam_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      steam_pressure: {
        type: DataTypes.DECIMAL(5, 2),
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
      tableName: "autoclave",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      paranoid: true,
      underscored: true,
    }
  );
  // Association: Autoclave belongs to Cutting via mould_no
  Autoclave.associate = (models) => {
    Autoclave.belongsTo(models.Cutting, {
      foreignKey: "mould_no",
      targetKey: "mould_no",
      as: "cutting_info",
    });

     Autoclave.hasMany(models.Segregation, {
    foreignKey: "mould_no",
     sourceKey: "mould_no",
    as: "segregation_entries",
  });
  };

  return Autoclave;
};
