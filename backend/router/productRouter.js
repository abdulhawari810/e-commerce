import {
  getProduct,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductByFilter,
  createTagsProduct,
  getTagsProduct,
  createAllProduct,
  SearchProduct,
  exportProductCSV,
} from "../controllers/products.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";
import express from "express";

const productRouter = express.Router();

productRouter.post("/product/filter", getProductByFilter);
productRouter.get("/product/search", SearchProduct);

productRouter.get("/product", getProduct);
productRouter.get("/product/tags/:tagId", getTagsProduct);
productRouter.get("/product/:id", getProductById);
productRouter.get("/product/export/file", exportProductCSV);

productRouter.post("/product", verifyToken, verifyAdmin, createProduct);
productRouter.post("/product/all", verifyToken, verifyAdmin, createAllProduct);
productRouter.post(
  "/product/tags",
  verifyToken,
  verifyAdmin,
  createTagsProduct
);
productRouter.patch("/product/:id", verifyToken, verifyAdmin, updateProduct);
productRouter.delete("/product/:id", verifyToken, verifyAdmin, deleteProduct);

export default productRouter;
