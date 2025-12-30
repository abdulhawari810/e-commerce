import Sequelize from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const db = new Sequelize(
  process.env.APP_DATABASE,
  process.env.APP_USER,
  process.env.APP_PASS,
  {
    host: process.env.APP_HOST,
    dialect: "mysql",
  },
);

export default db;
