module.exports = (sequelize, DataTypes) => {
  const Receiving = sequelize.define("Receiving", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
      user_id: {
        type: DataTypes.INTEGER,
      },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    supplier_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    invoice_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    received_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    material_details: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
    deleted_at: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'receiving_stock',
    timestamps: true, // enables createdAt and updatedAt
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true, // enables soft delete (deleted_at)
    deletedAt: 'deleted_at',
  });

  Receiving.associate = function (models) {
  Receiving.hasMany(models.Material, {
    foreignKey: "receiving_id",
    as: "materials",
  });
};
  return Receiving;
};