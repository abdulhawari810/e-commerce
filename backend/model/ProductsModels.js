import Sequelize from "sequelize";
import db from "../config/db.js";

const { DataTypes } = Sequelize;

const ProductModels = db.define(
  "products",
  {
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Product Slug is not Empty",
        },
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Product Title is not Empty",
        },
      },
    },
    thumbnails: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Product Title is not Empty",
        },
        isUrl: {
          args: true,
          msg: "Product Thumbnais is not valid URL",
        },
      },
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Product Title is not Empty",
        },
      },
    },
  },
  {
    frezeetableName: true,
  }
);

ProductModels.beforeCreate((products) => {
  if (products.descriptions) {
    products.descriptions = products.descriptions
      .split(/\r?\n+/)
      .map((p) => `<p>${p.trim()}</p>`)
      .join("");
  }
});

export default ProductModels;
