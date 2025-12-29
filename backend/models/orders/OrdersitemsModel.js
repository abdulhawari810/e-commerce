import { Sequelize } from "sequelize";
import db from "../../config/db.js";

const { DataTypes } = Sequelize;

const OrdersItemsModel = db.define(
  "orders_items",
  {
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Product Name not Empty",
        },
      },
    },
    product_price: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    quantity: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    total_price: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
  },
  { freezeTableName: true }
);

export default OrdersItemsModel;
