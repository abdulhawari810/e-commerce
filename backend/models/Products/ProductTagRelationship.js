import { Sequelize } from "sequelize";
import db from "../../config/db.js";

const { DataTypes } = Sequelize;

const ProductTagRelationship = db.define(
  "product_tags_relations",
  {
    productTagId: {
      type: DataTypes.INTEGER,
    },
    tagId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
  },
);

export default ProductTagRelationship;
