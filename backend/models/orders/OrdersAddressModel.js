import { Sequelize } from "sequelize";
import db from "../../config/db.js";

const { DataTypes } = Sequelize;

const OrdersAddressModel = db.define(
  "orders_addresses",
  {
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    recipient_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    postal_code: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    province: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  { freezeTableName: true }
);

export default OrdersAddressModel;
