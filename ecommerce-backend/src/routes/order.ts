import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import {
  allorders,
  deleteOrder,
  myOrders,
  newOrder,
  processOrder,
  singleOrder,
} from "../controllers/order.js";

const app = express.Router();

// route - /api/v1/order/new
app.post("/new", newOrder);

// route - /api/v1/order/my
app.get("/my", myOrders);

// route - /api/v1/order/all
app.get("/all", adminOnly, allorders);

app.route("/:id")
    .get(singleOrder)
    .put(adminOnly,processOrder)
    .delete(adminOnly,deleteOrder);

export default app;
