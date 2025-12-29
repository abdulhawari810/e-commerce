import { Sequelize } from "sequelize";
import db from "../../config/db.js";

const { DataTypes } = Sequelize;

const ProductTagModel = db.define(
  "product_tags",
  {
    name: {
      type: DataTypes.ENUM("best_seller", "flash_sale"),
    },
  },
  {
    freezeTableName: true,
  },
);

export default ProductTagModel;
