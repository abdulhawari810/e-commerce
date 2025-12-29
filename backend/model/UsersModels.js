import Sequelize from "sequelize";
import db from "../config/db.js";

const { DataTypes } = Sequelize;

const UsersModels = db.define(
  "users",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Username not Empty",
        },
        len: {
          args: [8, 100],
          msg: "Username harus terdiri dari 8 karakter hingga 100 karakter",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "email is not Empty",
        },
        isEmail: {
          args: true,
          msg: "This is not Valid Email Address",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
          msg: "Password harus terdiri dari minimal 8 karakter, huruf besar, huruf kecil, dan angka",
        },
      },
    },
    profile: {
      type: DataTypes.STRING,
      defaultValue: "default.png",
    },
    phone_number: {
      type: DataTypes.DOUBLE,
      defaultValue: null,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM("active", "banned"),
      defaultValue: "active",
    },
    role: {
      type: DataTypes.TEXT,
      defaultValue: "users",
    },
  },
  {
    frezeeTableName: true,
  }
);

export default UsersModels;
