import Sequelize from "sequelize";
import db from "../config/db.js";

const { DataTypes } = Sequelize;

const WhislistsModel = db.define(
  "whislist",
  {
    userId: {
      type: DataTypes.INTEGER,
    },
    productId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
  },
);

export default WhislistsModel;
