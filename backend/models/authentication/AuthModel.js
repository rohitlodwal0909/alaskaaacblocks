const { DataTypes } = require("sequelize");
const { sequelize } = require("../index");

const AuthModel = sequelize.define(
  "admins",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    timestamps: false, // createdAt, updatedAt
    paranoid: true, // enables soft delete (deletedAt)
    tableName: "admins"
  }
);

module.exports = AuthModel;
