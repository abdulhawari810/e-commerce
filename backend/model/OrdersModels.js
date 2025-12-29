import Sequelize from "sequelize";
import db from "../config/db.js";

const { DataTypes } = Sequelize;

const OrdersModels = db.define(
  "orders",
  {
    status: {
      type: DataTypes.ENUM(
        "pending",
        "paid",
        "shipped",
        "complete",
        "canceled"
      ),
    },
    total_price: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    payment_method: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Payment Method is not Empty!",
        },
      },
    },
    payment_status: {
      type: DataTypes.ENUM("unpaid", "paid", "expired"),
    },
  },
  {
    frezeeTableName: true,
  }
);

export default OrdersModels;
