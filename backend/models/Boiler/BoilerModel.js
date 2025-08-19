// models/boiler.model.js

module.exports = (sequelize, DataTypes) => {
  const Boiler = sequelize.define("Boiler", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
   time: {
      type: DataTypes.JSON, // ✅ now accepts array of times like ["08:00", "10:00"]
      allowNull: true,
    },
    feed_water_temp: {
      type: DataTypes.JSON, // ✅ now accepts array like ["85", "90", "87"]
      allowNull: true,
    },
    feed_water_tds: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    water_meter_reading: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    steam_pressure: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    stack_temp: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    inlet_temp: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    fd_fan_reading: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    ph_booster: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    antiscalnt_chemical: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    energy_meter_reading: {
      type: DataTypes.JSON,
      allowNull: true,
    },
   done_by: {
  type: DataTypes.STRING,  // ✅ valid Sequelize type
  allowNull: true,
},
    location: {
  type: DataTypes.STRING, // ✅ correct
  allowNull: true,
},
shift: {
  type: DataTypes.STRING, // ✅ correct
  allowNull: true,
},
 blow_tds: {
  type: DataTypes.STRING, // ✅ correct
  allowNull: true,
},
blow_ph: {
  type: DataTypes.STRING, // ✅ correct
  allowNull: true,
},
date: {
  type: DataTypes.DATE,   // ✅ this is fine
  allowNull: true,
},
total_wood_consumption: {
  type: DataTypes.STRING, // ✅ correct
  allowNull: true,
},
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'boiler',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true, // Enables soft deletes
  });

  return Boiler;
};
