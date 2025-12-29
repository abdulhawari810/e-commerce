import { Sequelize } from "sequelize";
import db from "../../config/db.js";

const { DataTypes } = Sequelize;

const ShippingOrdersModel = db.define(
  "shipping_orders",
  {
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    courier: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    service: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tracking_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shuipped_at: {
      type: DataTypes.DATETIME,
      allowNull: true,
    },
    delivered_at: {
      type: DataTypes.DATETIME,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("preparing", "shipped", "delivered"),
      defaultValue: "preparing",
    },
  },
  { freezeTableName: true }
);

export default ShippingOrdersModel;
