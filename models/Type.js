const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Type = sequelize.define("types", {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
  },
});

module.exports = Type;
