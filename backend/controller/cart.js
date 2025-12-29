import {
  UsersModels,
  UsersAddressModels,
  ProductModels,
  ProductDetailsModels,
  CartsModels,
  CartItemsModels,
  WhislistModels,
  OrdersModels,
  OrdersItemsModels,
} from "../model/Relationship.js";
import { io } from "../index.js";
import sequelize from "../config/db.js";

export const getCarts = async (req, res) => {};
export const getCartsById = async (req, res) => {
  const { user_id } = req.query;

  const cart = await CartsModels.findOne({
    where: { user_id },
    include: [
      {
        model: CartItemsModels,
        as: "items",
        include: [
          {
            model: ProductModels,
            as: "product",
            include: [{ model: ProductDetailsModels, as: "details" }],
          },
        ],
      },
    ],
  });

  if (!cart) return res.json({ items: [], total: 0 });

  // hitung total harga
  const total = cart.items.reduce((acc, item) => {
    const discount = item.product.details?.[0]?.discount || 0;
    const price = item.product.price - (item.product.price * discount) / 100;

    const final = price * item.qty;
    return acc + final;
  }, 0);

  res.json({
    items: cart.items,
    total,
  });
};

export const createCartsByUsers = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { userId, productId, qty } = req.body;

    // Ambil atau buat cart user
    let cart = await CartsModels.findOne({
      where: { user_id: userId },
      transaction: t,
    });

    if (!cart) {
      cart = await CartsModels.create({ user_id: userId }, { transaction: t });
    }

    // Cek existing item
    const existingItem = await CartItemsModels.findOne({
      where: { cart_id: cart.id, product_id: productId },
      transaction: t,
    });

    if (existingItem) {
      existingItem.qty += qty;
      await existingItem.save({ transaction: t });
    } else {
      await CartItemsModels.create(
        {
          cart_id: cart.id,
          product_id: productId,
          qty,
        },
        { transaction: t },
      );
    }

    await t.commit();

    // Emit sinyal bahwa cart berubah
    io.to(`user_${userId}`).emit("cart-updated", { updated: true });

    res.status(200).json({
      message: "Produk berhasil masuk keranjang",
    });
  } catch (err) {
    if (!t.finished) await t.rollback();
    res.status(500).json({ error: err.message });
  }
};
export const updateQty = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { userId, productId, qty } = req.body;

    const cart = await CartsModels.findOne({
      where: { user_id: userId },
      transaction: t,
    });

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = await CartItemsModels.findOne({
      where: { cart_id: cart.id, product_id: productId },
      transaction: t,
    });

    if (!item) return res.status(404).json({ error: "Item not found" });

    item.qty = qty;
    await item.save({ transaction: t });

    await t.commit();

    // Hitung ulang jumlah item di cart
    const count = await CartItemsModels.count({
      where: { cart_id: cart.id },
    });

    io.to(`user_${userId}`).emit("cart-updated", { count });

    res.status(200).json({ message: "Quantity updated", count });
  } catch (err) {
    if (!t.finished) await t.rollback();
    res.status(500).json({ error: err.message });
  }
};

export const countCartsById = async (req, res) => {
  try {
    const { userId } = req.query;
    const cart = await CartsModels.findOne({
      where: { user_id: userId },
      include: [{ model: CartItemsModels, as: "items" }],
    });
    if (!cart) return res.json({ count: 0 });
    const count = Array.isArray(cart.items) ? cart.items.length : 0;
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const removeCartItem = async (req, res) => {
  try {
    const { userId, cartItemId } = req.body;

    const item = await CartItemsModels.findByPk(cartItemId);
    if (!item) return res.status(404).json({ message: "Not found" });

    await item.destroy();

    // hitung ulang
    const cart = await CartsModels.findOne({
      where: { user_id: userId },
      include: [{ model: CartItemsModels, as: "items" }],
    });
    const count = Array.isArray(cart?.items) ? cart.items.length : 0;

    io.to(`user_${userId}`).emit("cart-updated", { count });

    return res.json({ message: "Product Berhasil dihapus", count });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
