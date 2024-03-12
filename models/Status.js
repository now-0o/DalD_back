const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Status = sequelize.define("statuses", {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
  },
});

module.exports = Status;
