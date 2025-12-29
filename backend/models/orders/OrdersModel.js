import { Sequelize } from "sequelize";
import db from "../../config/db.js";

const { DataTypes } = Sequelize;

const OrdersModel = db.define(
  "orders",
  {
    order_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "paid",
        "shipped",
        "completed",
        "cancelled"
      ),
      defaultValue: "pending",
    },
    subtotal: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    total_amount: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    discount: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    shipping_cost: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    payment_method_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    shipping_method_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  { freezeTableName: true }
);

export default OrdersModel;
