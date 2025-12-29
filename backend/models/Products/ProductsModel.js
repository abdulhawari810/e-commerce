import Sequelize from "sequelize";
import db from "../../config/db.js";

const { DataTypes } = Sequelize;

const ProductsModel = db.define(
  "product",
  {
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Judul wajib diisi",
        },
      },
    },
    judul: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Judul wajib diisi",
        },
      },
    },
    harga: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Gambar wajib diisi",
        },
      },
    },
    stok: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    diskon: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("active", "draft", "in_active"),
      defaultValue: "active",
    },
    tipe: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default ProductsModel;
