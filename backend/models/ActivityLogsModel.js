import Sequelize from "sequelize";
import db from "../config/db.js";

const { DataTypes } = Sequelize;

const ActivityLogModel = db.define(
  "activity_logs",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Title is not empty!",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Descriptions is not empty!",
        },
      },
    },
    status: {
      type: DataTypes.ENUM("success", "pending", "failed"),
      allowNull: true,
    },
    tipe: {
      type: DataTypes.ENUM(
        "products",
        "reviews",
        "comments",
        "orders",
        "shippings"
      ),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default ActivityLogModel;
