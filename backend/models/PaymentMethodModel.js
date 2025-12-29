import { Sequelize } from "sequelize";
import db from "../config/db.js";

const { DataTypes } = Sequelize;

const PaymentMethodModel = db.define(
  "payment_method",
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
    freezeTableName: true,
  }
);

export default PaymentMethodModel;
