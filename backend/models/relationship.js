import WhislistsModel from "./WhislistModel.js";
import CartsModel from "./CartsModel.js";
import UsersModel from "./UsersModel.js";

// product model
import ProductsModel from "./Products/ProductsModel.js";
import ProductsDetailModel from "./Products/ProductDetail.js";
import ProductTagModel from "./Products/ProductTagModel.js";
import ProductTagRelationship from "./Products/ProductTagRelationship.js";

// orders model
import OrdersModel from "./orders/OrdersModel.js";
import OrdersItemsModel from "./orders/OrdersItemsModel.js";
import OrdersStatusModel from "./orders/OrdersStatusModel.js";
import OrdersAddressModel from "./orders/OrdersAddressModel.js";
import PaymentMethodModel from "./PaymentMethodModel.js";
import ShippingMethodModel from "./ShippingMethodModel.js";

// relationship product & detail

ProductsModel.hasOne(ProductsDetailModel, {
  foreignKey: "productId",
  as: "detail",
  onDelete: "CASCADE",
});

ProductsDetailModel.belongsTo(ProductsModel, {
  foreignKey: "productId",
  as: "product",
});

// PRODUCT ↔ CART
ProductsModel.hasMany(CartsModel, {
  foreignKey: "productId",
  as: "carts",
});

CartsModel.belongsTo(ProductsModel, {
  foreignKey: "productId",
  as: "product",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// USER ↔ CART
UsersModel.hasMany(CartsModel, {
  foreignKey: "userId",
  as: "carts",
});

CartsModel.belongsTo(UsersModel, {
  foreignKey: "userId",
  as: "user",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// relationship product & whislist
ProductsModel.hasMany(WhislistsModel, {
  foreignKey: "productId",
  as: "product_whislist",
});

WhislistsModel.belongsTo(ProductsModel, {
  foreignKey: "productId",
  as: "whislist_product",
  onDelete: "CASCADE",
});

ProductsModel.belongsToMany(ProductTagModel, {
  through: ProductTagRelationship,
  foreignKey: "productTagId",
  otherKey: "tagId",
  as: "tags",
});

ProductTagModel.belongsToMany(ProductsModel, {
  through: ProductTagRelationship,
  foreignKey: "tagId",
  otherKey: "productTagId",
  as: "products",
});

// orders & users

UsersModel.hasMany(OrdersModel, {
  foreignKey: "user_id",
  as: "users_orders",
});

OrdersModel.belongsTo(UsersModel, {
  foreignKey: "user_id",
  as: "orders_users",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// orders & orders_items

OrdersModel.hasMany(OrdersItemsModel, {
  foreignKey: "order_id",
  as: "orders_items",
});

OrdersItemsModel.belongsTo(OrdersModel, {
  foreignKey: "order_id",
  as: "items_orders",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// orders & orders_address

OrdersModel.hasOne(OrdersAddressModel, {
  foreignKey: "order_id",
  as: "orders_address",
});

OrdersAddressModel.belongsTo(OrdersModel, {
  foreignKey: "order_id",
  as: "address_orders",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// orders & payment_orders

OrdersModel.hasOne(PaymentMethodModel, {
  foreignKey: "payment_method_id",
  as: "orders_payment",
});

PaymentMethodModel.belongsTo(OrdersModel, {
  foreignKey: "payment_method_id",
  as: "payment_orders",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// orders & shipping_orders

OrdersModel.hasOne(ShippingMethodModel, {
  foreignKey: "shipping_method_id",
  as: "orders_shipping",
});

ShippingMethodModel.belongsTo(OrdersModel, {
  foreignKey: "shipping_method_id",
  as: "shipping_orders",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// orders & orders_status

OrdersModel.hasMany(OrdersStatusModel, {
  foreignKey: "order_id",
  as: "orders_status",
});

OrdersStatusModel.belongsTo(OrdersModel, {
  foreignKey: "order_id",
  as: "status_orders",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export {
  ProductsModel,
  ProductsDetailModel,
  CartsModel,
  WhislistsModel,
  UsersModel,
  ProductTagModel,
  ProductTagRelationship,
  OrdersModel,
  OrdersItemsModel,
  OrdersStatusModel,
  OrdersAddressModel,
  PaymentMethodModel,
  ShippingMethodModel,
};
