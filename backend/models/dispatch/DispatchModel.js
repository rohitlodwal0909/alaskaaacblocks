module.exports = (sequelize, DataTypes) => {
  const Dispatch = sequelize.define(
    "Dispatch",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
     user_id: {
        type: DataTypes.INTEGER,
      },
      vehicle_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      transport_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      driver_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      driver_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      delivery_area: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      invoice_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      eway_bill_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      material_details: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      quantity: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      size: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      loading_picture: {
        type: DataTypes.STRING,
        allowNull: true, // image might be optional
      },

      quality_check: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      person_responsible: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      time: {
        type: DataTypes.TIME,
        allowNull: false,
      },

      eway_bill_expiry: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      deleted_at: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "dispatch",
      underscored: true,
      timestamps: true,
      paranoid: true, // enables soft delete
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return Dispatch;
};
