require("dotenv").config();
const Sequelize = require("sequelize");
const cls = require("cls-hooked");
const namespace = cls.createNamespace("sequelize-namespace");
Sequelize.useCLS(namespace);

const sequelize = new Sequelize("DalD", "root", process.env.databasePassword, {
  host: "localhost",
  dialect: "mysql",
  logging: false,
  port: 3306,
  define: {
    timestamps: true, // timestamps 활성화
  },
  timezone: "+09:00", // 타임존을 Asia/Seoul로 설정
});

const checkConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

checkConnection();

module.exports = sequelize;
