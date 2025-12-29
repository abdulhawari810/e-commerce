import Sequelize from "sequelize";
import db from "../config/db.js";

const { DataTypes } = Sequelize;

const CartItemsModels = db.define(
  "cart_items",
  {
    cart_id: {
      type: DataTypes.INTEGER,
    },
    product_id: {
      type: DataTypes.INTEGER,
    },
    qty: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
  },
  {
    frezeeTableName: true,
  }
);

export default CartItemsModels;
