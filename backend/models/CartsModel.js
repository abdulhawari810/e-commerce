import Sequelize from "sequelize";
import db from "../config/db.js";

const { DataTypes } = Sequelize;

const CartsModel = db.define(
  "cart",
  {
    userId: {
      type: DataTypes.INTEGER,
    },
    productId: {
      type: DataTypes.INTEGER,
    },
    qty: {
      type: DataTypes.BIGINT,
      defaultValue: 1,
    },
  },
  {
    freezeTableName: true,
  },
);

export default CartsModel;
