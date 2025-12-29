import { Op, where } from "sequelize";
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
import slugify from "slugify";

export const getProducts = async (req, res) => {
  const { Filter } = req.query;
  try {
    let filters = [];

    if (Filter.trim() === "Produk Terbaru") {
      filters.push(["id", "DESC"]);
    }
    if (Filter.trim() === "Harga Termurah") {
      filters.push(["price", "ASC"]);
    }

    if (Filter.trim() === "Harga Tertinggi") {
      filters.push(["price", "DESC"]);
    }

    const products = await ProductModels.findAll({
      order: filters,
      include: {
        model: ProductDetailsModels,
        as: "details",
      },
    });

    if (products.length < 0)
      return res.status(404).json({ error: "Product Not Found" });

    res.status(200).json({
      message: "Product Found",
      product: products,
      Filter: filters,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getProductsById = async (req, res) => {};
export const updateProducts = async (req, res) => {};
export const createAllProduct = async (req, res) => {
  try {
    const data = req.body;

    for (const e of data) {
      const title = e.title + " - " + e.colors;
      const thumbnails = e.thumbnails;
      const price = e.price;
      const type = e.type;
      const code_name = e.code_name;
      const descriptions = e.descriptions;
      const colors = e.colors;
      const discount = e.discount;
      const stock = e.stock;
      const size = e.size;
      const img_detail = e.img_detail;
      const slug = slugify(title, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
      });

      const product = await ProductModels.create({
        slug,
        title,
        thumbnails,
        price,
      });

      await ProductDetailsModels.create({
        product_id: product.id,
        type,
        colors,
        discount,
        stock,
        img_detail,
        size,
        descriptions,
        code_name,
      });
    }

    res.status(201).json({ message: "Products Created!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const deleteProducts = async (req, res) => {};
