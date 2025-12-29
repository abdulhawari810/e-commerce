import UsersAddressModels from "./UsersAddressModels.js";
import CartsModels from "./CartsModels.js";
import CartItemsModels from "./CartsItemsModels.js";
import OrdersModels from "./OrdersModels.js";
import OrdersItemsModels from "./OrdersItemsModels.js";
import UsersModels from "./UsersModels.js";
import ProductModels from "./ProductsModels.js";
import ProductDetailsModels from "./ProductsDetailsModels.js";
import WhislistModels from "./WhislistsModels.js";

// USERS -> CART
UsersModels.hasOne(CartsModels, {
  foreignKey: "user_id",
  as: "cart",
  onDelete: "CASCADE",
});
CartsModels.belongsTo(UsersModels, {
  foreignKey: "user_id",
  as: "user",
});

// CART -> CART ITEMS
CartsModels.hasMany(CartItemsModels, {
  foreignKey: "cart_id",
  as: "items",
  onDelete: "CASCADE",
});
CartItemsModels.belongsTo(CartsModels, {
  foreignKey: "cart_id",
  as: "cart",
});

// PRODUCT -> PRODUCT DETAILS
ProductModels.hasMany(ProductDetailsModels, {
  foreignKey: "product_id",
  as: "details",
  onDelete: "CASCADE",
});
ProductDetailsModels.belongsTo(ProductModels, {
  foreignKey: "product_id",
  as: "product",
});

// PRODUCT -> CART ITEMS
ProductModels.hasMany(CartItemsModels, {
  foreignKey: "product_id",
  as: "cart_items",
});
CartItemsModels.belongsTo(ProductModels, {
  foreignKey: "product_id",
  as: "product",
});

// USERS -> ORDERS
UsersModels.hasMany(OrdersModels, {
  foreignKey: "user_id",
  as: "orders",
  onDelete: "CASCADE",
});
OrdersModels.belongsTo(UsersModels, {
  foreignKey: "user_id",
  as: "user",
});

// ADDRESS -> ORDERS
UsersAddressModels.hasMany(OrdersModels, {
  foreignKey: "address_id",
  as: "orders",
});
OrdersModels.belongsTo(UsersAddressModels, {
  foreignKey: "address_id",
  as: "address",
});

// PRODUCT -> ORDER ITEMS
ProductModels.hasMany(OrdersItemsModels, {
  foreignKey: "product_id",
  as: "order_items",
});
OrdersItemsModels.belongsTo(ProductModels, {
  foreignKey: "product_id",
  as: "product",
});

// WISHLIST -> PRODUCT
ProductModels.hasMany(WhislistModels, {
  foreignKey: "product_id",
  as: "wishlists",
});
WhislistModels.belongsTo(ProductModels, {
  foreignKey: "product_id",
  as: "product",
});

// WISHLIST -> USERS
UsersModels.hasMany(WhislistModels, {
  foreignKey: "user_id",
  as: "wishlists",
});
WhislistModels.belongsTo(UsersModels, {
  foreignKey: "user_id",
  as: "user",
});

export {
  UsersModels,
  UsersAddressModels,
  ProductModels,
  ProductDetailsModels,
  CartsModels,
  CartItemsModels,
  WhislistModels,
  OrdersModels,
  OrdersItemsModels,
};
