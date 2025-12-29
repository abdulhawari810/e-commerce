import { Sequelize } from "sequelize";
import db from "../config/db.js";

const { DataTypes } = Sequelize;

const ShippingMethodModel = db.define(
  "shipping_method",
  {
    code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.ENUM("active", "not_active"),
      defaultValue: "active",
    },
  },
  {
    freeezeTableName: true,
  }
);

export default ShippingMethodModel;
