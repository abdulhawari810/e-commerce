import Sequelize from "sequelize";
import db from "../config/db.js";

const { DataTypes } = Sequelize;

const OrdersItemsModels = db.define(
  "orders_items",
  {
    qty: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    price: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
  }
);

export default OrdersItemsModels;
