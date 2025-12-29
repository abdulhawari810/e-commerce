import { Sequelize } from "sequelize";
import db from "../../config/db.js";

const { DataTypes } = Sequelize;

const OrdersStatusModel = db.define(
  "orders_status",
  {
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "paid",
        "processing",
        "shipped",
        "completed",
        "cancelled",
        "refunded"
      ),
      defaultValue: "pending",
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default OrdersStatusModel;
