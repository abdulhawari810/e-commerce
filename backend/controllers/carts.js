import {
  CartsModel,
  UsersModel,
  ProductsModel,
} from "../models/relationship.js";
import { io, userSocket } from "../main.js";
import { fn, col, where } from "sequelize";
import { emitCartUpdate } from "../helper/emitCartUpdate.js";

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const users = await UsersModel.findByPk(userId);
    const cart = await CartsModel.findAll({
      where: {
        userId: users.id,
      },
      order: [["id", "DESC"]],
      include: {
        model: ProductsModel,
        as: "product",
      },
    });

    if (!users)
      return res
        .status(404)
        .json({ error: true, code: 404, message: "Users tidak ditemukan!" });

    if (cart.length === 0)
      return res.status(404).json({
        error: true,
        code: 404,
        message: "Keranjang tidak ditemukan!",
      });

    res.status(200).json({
      success: true,
      code: 200,
      message: "Keranjang berhasil ditemukan!",
      cart,
    });
  } catch (err) {
    res.status(500).json({ error: true, code: 500, message: err.message });
  }
};
export const getCartGuest = async (req, res) => {
  try {
    const { parsing } = req.body;
    const data = [];

    for (const item of parsing) {
      if (!item || !item.productId) continue;

      const product = await ProductsModel.findOne({
        where: { id: item.productId },
        order: [["id", "DESC"]],
      });

      if (product) {
        data.push({ product, qty: item.qty });
      }
    }
    res.status(200).json({
      success: true,
      code: 200,
      message: "Produk ditemukan!",
      data,
    });
  } catch (err) {
    res.status(500).json({ error: true, code: 500, message: err.message });
  }
};
export const createCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, qty } = req.body;

    const qtyInt = Number(qty);

    if (!qtyInt || qtyInt <= 0) {
      return res.status(400).json({
        error: true,
        message: "Qty tidak valid",
      });
    }

    // VALIDASI FK
    const user = await UsersModel.findByPk(userId);
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "User tidak ditemukan",
      });
    }

    const product = await ProductsModel.findByPk(productId);
    if (!product) {
      return res.status(400).json({
        error: true,
        message: "Produk tidak ditemukan",
      });
    }

    const cart = await CartsModel.findOne({
      where: { userId, productId },
    });

    if (cart) {
      await CartsModel.update(
        { qty: cart.qty + qtyInt },
        { where: { userId, productId } },
      );
    } else {
      await CartsModel.create({
        userId,
        productId,
        qty: qtyInt,
      });
    }

    const totalCount = await CartsModel.count({
      where: { userId },
    });

    const socketId = userSocket[userId];
    if (socketId) {
      io.to(socketId).emit("cart:count:update", totalCount);
    }

    await emitCartUpdate(io, userSocket, userId);

    res.status(201).json({
      success: true,
      message: "Produk berhasil ditambahkan ke keranjang",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};
export const createCartSync = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cart } = req.body;

    for (const item of cart) {
      const existing = await CartsModel.findOne({
        where: {
          userId,
          productId: item.productId,
        },
      });

      if (existing) {
        existing.qty += qty;
        await existing.save();
      } else {
        await CartsModel.create({
          userId,
          productId: item.productId,
          qty: item.qty,
        });
      }
    }

    const totalCount = await CartsModel.count({
      where: { userId },
    });

    const socketId = userSocket[userId];
    if (socketId) {
      io.to(socketId).emit("cart:count:update", totalCount);
    }

    await emitCartUpdate(io, userSocket, userId);

    res.status(201).json({
      success: true,
      message: "Produk berhasil ditambahkan ke keranjang",
    });
  } catch (err) {
    res.status(500).json({ error: true, code: 500, message: err.message });
  }
};
export const getCountCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const countCart = await CartsModel.count({ where: { userId } });

    if (!countCart) return res.json({ countCart: 0 });

    res.json({ countCart });
  } catch (err) {
    res.status(500).json({ error: true, code: 500, message: err.message });
  }
};
export const deleteCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const users = await UsersModel.findByPk(userId);
    const product = await ProductsModel.findByPk(productId);
    const cart = await CartsModel.findOne({
      where: {
        productId: product.id,
      },
    });

    if (!users)
      return res
        .status(404)
        .json({ error: true, code: 404, message: "Users tidak ditemukan!" });

    if (!product)
      return res
        .status(404)
        .json({ error: true, code: 404, message: "Produk tidak ditemukan!" });

    if (!cart)
      return res.status(404).json({
        error: true,
        code: 404,
        message: "Produk tidak ditemukan!",
      });

    await CartsModel.destroy({
      where: {
        userId: users.id,
        productId: product.id,
      },
    });
    const totalCount = await CartsModel.count({
      where: { userId },
    });

    const socketId = userSocket[userId];
    if (socketId) {
      io.to(socketId).emit("cart:count:update", totalCount);
    }

    await emitCartUpdate(io, userSocket, userId);

    res.status(201).json({
      success: true,
      message: "Produk berhasil dihapus",
    });
  } catch (err) {
    res.status(500).json({ error: true, code: 500, message: err.message });
  }
};
export const updateCartQty = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { qty } = req.body;

    const qtyInt = Number(qty);

    if (!qtyInt || qtyInt < 1) {
      return res
        .status(400)
        .json({ error: true, code: 400, message: "QTY tidak valid" });
    }

    const cart = await CartsModel.findOne({
      where: { userId, productId },
    });

    if (!cart) {
      return res.status(404).json({
        error: true,
        code: 404,
        message: "Keranjang kamu masih kosong!",
      });
    }

    cart.qty = qtyInt;

    await cart.save();

    await emitCartUpdate(io, userSocket, userId);

    res
      .status(201)
      .json({ success: true, code: 201, message: "qty berhasil diupdate" });
  } catch (err) {
    res.status(500).json({ error: true, code: 500, message: err.message });
  }
};
