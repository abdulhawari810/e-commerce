import Sequelize from "sequelize";
import db from "../config/db.js";

const { DataTypes } = Sequelize;

const CartsModels = db.define(
  "cart",
  {},
  {
    frezeTableName: true,
  }
);

export default CartsModels;
