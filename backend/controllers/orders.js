import {
  OrdersModel,
  OrdersAddressModel,
  OrdersItemsModel,
  OrdersStatusModel,
  PaymentMethodModel,
  ShippingMethodModel,
  UsersModel,
  CartsModel,
  ProductsModel,
  ProductsDetailModel,
} from "../models/relationship.js";
import ActivityLogModel from "../models/ActivityLogsModel.js";

export const getOrders = async (req, res) => {};
export const createOrders = async (req, res) => {
  try {
    const user = req.user;
    const order = req.body;

    for (const o of order) {
      const productId = o.productId;
      const qty = o.qty;
      const price = o.price;
      const totalPrice = price * qty;
      const paymentMethod = o.payment;
      const shippingMethod = o.shipping;
      const note = o.note;

      const payment = await PaymentMethodModel.findOne({
        where: {
          code: paymentMethod,
        },
      });
      const shipping = await ShippingMethodModel.findOne({
        where: {
          code: shippingMethod,
        },
      });

      await OrdersModel.create({
        user_id: user.id,
        payment_method_id: payment.id,
        shipping_method_id: shipping.id,
      });
    }
  } catch (error) {
    res.status(500).json({ error: true, code: 500, message: error.message });
  }
};
export const updateOrders = async (req, res) => {};
export const deleteOrders = async (req, res) => {};
