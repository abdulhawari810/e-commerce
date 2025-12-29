import { where } from "sequelize";
import {
  WhislistsModel,
  UsersModel,
  ProductsModel,
} from "../models/relationship.js";

export const getWhislist = async (req, res) => {
  try {
    const userId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const users = await UsersModel.findByPk(userId);

    if (!users)
      return res.status(404).json({
        error: true,
        code: 404,
        message: "tidak ada produk yang disimpan!",
      });

    const { count, rows } = await WhislistsModel.findAndCountAll({
      where: {
        userId,
      },
      limit,
      offset,
      include: {
        model: ProductsModel,
        as: "whislist_product",
      },
    });

    res.status(200).json({
      success: true,
      code: 200,
      message: "Whislist berhasil ditemukan!",
      data: rows,
      pagination: {
        totalData: count,
        totalPage: Math.ceil(count / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (err) {
    res.status(500).json({ error: true, code: 500, message: err.message });
  }
};
export const createWhislist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const users = await UsersModel.findByPk(userId);
    const product = await ProductsModel.findByPk(productId);

    const whislist = await WhislistsModel.findOne({
      where: {
        userId,
        productId: product.id,
      },
    });

    if (!users)
      return res
        .status(404)
        .json({ error: true, code: 404, message: "Users Tidak ditemukan!" });
    if (!product)
      return res
        .status(404)
        .json({ error: true, code: 404, message: "Product Tidak ditemukan!" });

    if (whislist)
      return res.status(404).json({
        error: true,
        code: 404,
        message: "Product ini sudah disimpan!",
      });

    await WhislistsModel.create({
      userId: users.id,
      productId: product.id,
    });

    res
      .status(201)
      .json({ error: true, code: 201, message: "Product berhasil disimpan!" });
  } catch (err) {
    res.status(500).json({ error: true, code: 500, message: err.message });
  }
};
export const deleteWhislist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const users = await UsersModel.findByPk(userId);
    const product = await ProductsModel.findByPk(productId);

    if (!users)
      return res.status(404).json({
        error: true,
        code: 404,
        message: "Product yang disimpan tidak ditemukan!",
      });
    if (!product)
      return res.status(404).json({
        error: true,
        code: 404,
        message: "Product yang disimpan tidak ditemukan!",
      });

    const whislist = await WhislistsModel.findOne({
      where: {
        productId: product.id,
      },
    });

    if (!whislist)
      return res.status(404).json({
        error: true,
        code: 404,
        message: "Product tidak ditemukan!",
      });

    await WhislistsModel.destroy({
      where: {
        userId: users.id,
        productId: product.id,
      },
    });

    res.status(201).json({
      error: true,
      code: 201,
      message: "Product yang disimpan berhasil dihapus!",
    });
  } catch (err) {
    res.status(500).json({ error: true, code: 500, message: err.message });
  }
};
