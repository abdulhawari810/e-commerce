import { Sequelize } from "sequelize";
import db from "../../config/db.js";

const { DataTypes } = Sequelize;

const PaymentOrdersModel = db.define(
  "payment_orders",
  {
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payment_provide: {
      type: DataTypes.ENUM("midtrans", "xendit", "tripay", "manual"),
      defaultValue: "manual",
    },
    amount: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("pending", "success", "failed", "refunded"),
    },
    paid_at: {
      type: DataTypes.DATETIME,
      allowNull: true,
    },
  },
  { freezeTableName: true }
);

export default PaymentOrdersModel;
