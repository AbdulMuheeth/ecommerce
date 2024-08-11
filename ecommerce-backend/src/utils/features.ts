// mongodb://localhost:27017/
import mongoose from "mongoose";
import { BarChartData, InvalidateCacheProps, myDocument, OrderItemType } from "../types/types.js";
import { Product } from "../models/product.js";
import { myCache } from "../app.js";
import { Order } from "../models/order.js";

export const connectDB = (uri: string) => {
  mongoose
    .connect(uri, {
      dbName: "Ecommerce24",
    })
    .then((c) => {
      console.log(`DB connected to ${c.connection.host}`);
    })
    .catch((e) => {
      console.log(e);
    });
};

export const invalidateCache = ({
  product,
  order,
  admin,
  userId,
  orderId,
  productId,
}: InvalidateCacheProps) => {
  if (product) {
    const productKeys = ["latest-products", "admin-products", "all-categories"];

    if (typeof productId === "string") productKeys.push(`product-${productId}`);
    else {
      productId?.map((i) => productKeys.push(`product-${i}`));
    }
    // const products = await Product.find({}).select("_id"); // to select particular field
    // for (let pk of products) {
    //   productKeys.push(`product-${pk}`);
    // }

    myCache.del(productKeys);
  }
  if (order) {
    const orderkeys = ["all-orders", `my-orders-${userId}`, `order-${orderId}`];
    // const ids = await Order.find({}).select("_id"); // when item is deleted then its gets 0 and unable to get order ID to remove it from cache

    // ids.forEach((id) => {
    //   orderkeys.push(`order-${id._id}`);
    // });

    myCache.del(orderkeys);
  }
  if (admin) {

    myCache.del(["admin-stats","admin-pie-charts","admin-bar-charts","admin-line-charts"]);

  }
};

export const reduceStock = async (orderItems: OrderItemType[]) => {
  orderItems.forEach(async (item) => {
    let product = await Product.findById(item.productId);
    if (!product) throw new Error("Product with given id is not found");
    product.stock = product.stock - item.quantity;
    await product.save();
  });
};

export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
  if (lastMonth === 0) return thisMonth * 100;
  return Number((((thisMonth) / lastMonth) * 100).toFixed(0));
};

export const getInventories = async ({
  categories,
  productCount,
}: {
  categories: string[];
  productCount: number;
}) => {

  const categoryCount = categories.map((category) =>
    Product.countDocuments({ category })
  );

  const inventoryCount = await Promise.all(categoryCount);

  // in this approach typescript can infer the types of acc based on the type parameter provided
  const inventory = categories.reduce(
    (acc: { name: string; count: number }[], curr, pos) => {
      return [
        ...acc,
        {
          name: curr,
          count: inventoryCount[pos],
          percentage: Math.round(
            (inventoryCount[pos] / productCount) * 100
          ),
        },
      ];
    },
    []
  );

  return inventory;

};


export const getChartData = ({length,docArr,today,property}:BarChartData) => {

  let data = new Array(length).fill(0);

  docArr.forEach((i) => {
    const creationDate = i.createdAt;
    const monthDiff = (today.getMonth() - creationDate.getMonth()+12)%12;

    if (monthDiff < length) {
      data[length - monthDiff - 1] += property ? i[property] : 1;
    }
  });

  return data;

}