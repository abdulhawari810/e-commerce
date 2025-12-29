import Sequelize from "sequelize";
import db from "../config/db.js";

const { DataTypes } = Sequelize;

const UsersAddressModels = db.define(
  "users_address",
  {
    address_uuid: {
      type: DataTypes.TEXT,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Name is not Empty",
        },
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Phone Number is not Empty",
        },
      },
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Address is not Empty",
        },
      },
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "City is not Empty",
        },
      },
    },
    postal_code: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Postal Code is not Empty",
        },
      },
    },
    is_main: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    frezeeTableName: true,
  }
);

export default UsersAddressModels;
