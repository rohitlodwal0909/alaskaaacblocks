module.exports = (sequelize, DataTypes) => {
  const Security = sequelize.define(
    "Security",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      mobile_no: {
        type: DataTypes.STRING,
        allowNull: true
      },
      vehicle_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      vehicle_no: {
        type: DataTypes.STRING,
        allowNull: true
      },
      product_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      from: {
        type: DataTypes.STRING,
        allowNull: true
      },
      to: {
        type: DataTypes.STRING,
        allowNull: true
      },
      in_time: {
        type: DataTypes.TIME,
        allowNull: true
      },
      out_time: {
        type: DataTypes.TIME,
        allowNull: true
      },
      signature: {
        type: DataTypes.ENUM("Yes", "No"),
        allowNull: false
      },
      deleted_at: {
        type: DataTypes.DATE
      }
    },
    {
      tableName: "securities", // 👈 your DB table name
      underscored: true,
      timestamps: true,
      paranoid: true, // enables soft delete
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at"
    }
  );

  return Security;
};
