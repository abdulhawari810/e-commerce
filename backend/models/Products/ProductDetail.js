import Sequelize from "sequelize";
import db from "../../config/db.js";

const { DataTypes } = Sequelize;

const ProductsDetailModel = db.define(
  "product_detail",
  {
    productId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    colors: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    size: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image_detail: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    material: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    weight: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    feature: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  },
);

ProductsDetailModel.beforeCreate((product) => {
  if (product.desc) {
    product.desc = product.desc
      .split(/\r?\n+/)
      .map((p) => `<p>${p.trim()}</p>`)
      .join("");
  }
});

ProductsDetailModel.beforeUpdate((product) => {
  if (product.changed("desc") && product.desc) {
    product.desc = product.desc
      .split(/\r?\n+/)
      .map((p) => `<p>${p.trim()}</p>`)
      .join("");
  }
});

export default ProductsDetailModel;
