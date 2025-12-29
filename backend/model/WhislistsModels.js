import Sequelize from "sequelize";
import db from "../config/db.js";

const { DataTypes } = Sequelize;

const WhislistModels = db.define(
  "whislist",
  {},
  {
    freezeTableName: true,
  }
);

export default WhislistModels;
