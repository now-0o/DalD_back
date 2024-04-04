const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Color = sequelize.define("Color", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  red: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  green: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  blue: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  alpha: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = Color;
