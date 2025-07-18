

module.exports = (sequelize, DataTypes) => {
  const Batching = sequelize.define(
    "Batching",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      batch_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      shift: {
        type: DataTypes.ENUM('Day', 'Night'),
        allowNull: false
      },
      operator_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      mould_no: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      slurry_waste: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      slurry_fresh: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      cement_qty: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      lime_qty: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      gypsum_qty: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      soluble_oil_qty: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      aluminium_qty: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      density: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      flow_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      temperature: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
      },
      entry_time: {
        type: DataTypes.TIME,
        allowNull: false
      },
      hardener_qty: {
        type: DataTypes.STRING,
        allowNull: false
      },
      remark: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      mould_oil_qty: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
       
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      paranoid: true,
      deletedAt: 'deleted_at',
      tableName: "batching_entries",
      underscored: true
    }
  );
Batching.associate = (models) => {
  Batching.hasMany(models.Rising, {
    foreignKey: "mould_no",
    sourceKey: "mould_no",
    as: "rising_info"
  });
};
  return Batching;
};
