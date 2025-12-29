import Sequelize from "sequelize";
import db from "../config/db.js";
const { DataTypes } = Sequelize;

const ProductDetailsModels = db.define(
  "products_detail",
  {
    colors: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    img_detail: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    discount: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    stock: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    size: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    descriptions: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

export default ProductDetailsModels;
