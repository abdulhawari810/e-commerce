import { fn, col } from "sequelize";
import { CartsModel, ProductsModel } from "../models/relationship.js";

export const emitCartUpdate = async (io, userSocket, userId) => {
  const cart = await CartsModel.findAll({
    where: { userId },
    order: [["id", "DESC"]],
    include: [
      {
        model: ProductsModel,
        as: "product",
      },
    ],
  });

  const socketId = userSocket[userId];

  if (socketId) {
    io.to(socketId).emit("cart:data:update", cart);
  }
};
