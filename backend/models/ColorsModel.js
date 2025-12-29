import Sequelize from "sequelize";
import db from "../config/db.js";

const { DataTypes } = Sequelize;

const ColorsModel = db.define(
  "colors",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  },
);

export default ColorsModel;
