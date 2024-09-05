import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";
import { myCache } from "../app.js";

export const myOrders = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: user } = req.query;
    const key = `my-orders-${user}`;
    let orders = [];

    if (myCache.has(key)) orders = JSON.parse(myCache.get(key) as string);
    else {
      orders = await Order.find({ user }).populate("user", "name");
      myCache.set(key, JSON.stringify(orders));
    }

    return res.status(200).json({
      success: true,
      orders,
    });
  }
);

export const allorders = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const key = `all-orders`;
    let orders = [];

    if (myCache.has(key)) orders = JSON.parse(myCache.get(key) as string);
    else {
      // orders = await Order.find({}).populate("orderItems.productId")
      orders = await Order.find({}).populate("user", "name"); // populate to get all reference Object value  (we can conditionally select specific field)
      myCache.set(key, JSON.stringify(orders));
    }

    return res.status(200).json({
      success: 200,
      orders,
    });
  }
);

export const singleOrder = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const key = `order-${id}`;

    let order;

    if (myCache.has(key)) order = JSON.parse(myCache.get(key) as string);
    else {
      // orders = await Order.find({}).populate("orderItems.productId")
      order = await Order.findById(id).populate("user", "name"); // populate to get all reference Object value  (we can conditionally select specific field)
      if (!order)
        return next(new ErrorHandler("Invalid OrderID, Order Not Found", 404));

      myCache.set(key, JSON.stringify(order));
    }

    return res.status(200).json({
      success: 200,
      order,
    });
  }
);

export const newOrder = TryCatch(
  async (
    req: Request<{}, {}, NewOrderRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const {
      shippingInfo,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
      orderItems,
    } = req.body;

    if (!shippingInfo || !user || !subtotal || !tax || !total || !orderItems)
      return next(new ErrorHandler("Please enter all Fields", 400));

    // has check for existance of the items & with required has been done?
    await Order.create({
      shippingInfo,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
      orderItems,
    });

    // after successful order creation
    // reduce stock
    await reduceStock(orderItems);

    invalidateCache({
      product: true,
      order: true,
      admin: true,
      userId: user,
      productId:orderItems.map(i=>String(i.productId))
    });

    return res.status(201).json({
      success: true,
      message: "Order placed Successfully",
    });
  }
);

export const processOrder = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order)
      return next(new ErrorHandler("Order With given ID Not found", 404));

    switch (order.status) {
      case "processing":
        order.status = "shipped";
        break;
      case "shipped":
        order.status = "delivered";
        break;
      default:
        order.status = "delivered";
        break;
    }

    await order.save();

    invalidateCache({
      product: false,
      order: true,
      admin: true,
      userId: order.user,
      orderId: String(order._id),
    });

    return res.status(200).json({
      success: true,
      message: "Order has been processed Successfully",
    });
  }
);

export const deleteOrder = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order)
      return next(new ErrorHandler("Order With given ID Not found", 404));

    await order.deleteOne();

    invalidateCache({
      product: false,
      order: true,
      admin: true,
      userId: order.user,
      orderId: String(order._id),
    });

    return res.status(201).json({
      success: true,
      message: "Order has been deleted Successfully",
    });
  }
);
