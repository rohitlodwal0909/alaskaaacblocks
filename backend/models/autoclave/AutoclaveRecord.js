module.exports = (sequelize, DataTypes) => {
  const AutoclaveRecord = sequelize.define("AutoclaveRecord", {
    autoclave_id: { type: DataTypes.INTEGER, allowNull: false },
    autoclave_no: DataTypes.STRING,
    material_receipt_time: DataTypes.STRING,
    door_closing_time: DataTypes.STRING,
    vacuum_on_time: DataTypes.STRING,
    vacuum_off_time: DataTypes.STRING,
    rising_pressure_time1: DataTypes.STRING,
    rising_pressure_value1: DataTypes.STRING,
    rising_pressure_time2: DataTypes.STRING,
    rising_pressure_value2: DataTypes.STRING,
    rising_pressure_time3: DataTypes.STRING,
    rising_pressure_value3: DataTypes.STRING,
    rising_pressure_time4: DataTypes.STRING,
    rising_pressure_value4: DataTypes.STRING,
    holding_pressure_time: DataTypes.STRING,
    holding_pressure_value: DataTypes.STRING,
    release_pressure_time: DataTypes.STRING,
    release_pressure_value: DataTypes.STRING,
    door_opening_time: DataTypes.STRING
  });

  AutoclaveRecord.associate = (models) => {
    AutoclaveRecord.belongsTo(models.Autoclave, {
      foreignKey: "autoclave_id",
      targetKey: "id",
      as: "autoclave"
    });
  };

  return AutoclaveRecord;
};
