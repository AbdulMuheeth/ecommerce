import express, { NextFunction, Request, Response } from 'express';
import { errorMiddleware, TryCatch } from './middlewares/error.js';
import { connectDB } from './utils/features.js';
import NodeCache from 'node-cache';
import { config } from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';

// Importing routes
import userRoute from './routes/user.js';
import productRoute from './routes/product.js';
import orderRoute from './routes/order.js';
import paymentRoute from './routes/payment.js';
import dashboardRoute from './routes/stats.js';
import Stripe from 'stripe';

// Initialize Express app
const app = express();
// app.options("*", cors());


// Load environment variables
config({ path: "./.env" });

export const myCache = new NodeCache();
export const stripe = new Stripe(process.env.STRIPE_KEY || "");

// Connect to database
connectDB(process.env.MONGO_URI || "");


// CORS middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type, Authorization'],
  credentials: true, // To allow cookies from client
  optionsSuccessStatus: 204
}));



// Middleware to parse JSON
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  // res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// app.options('*', cors({
//   origin: 'http://localhost:5173',
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   allowedHeaders: ['Content-Type, Authorization'],
//   credentials: true,
//   optionsSuccessStatus: 204
// }));
// HTTP request logger middleware
app.use(morgan("dev"));


// Define routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);

// Root route
app.get("/api/v1/test", async(req, res) => {
  try{
    console.log(res.getHeaders());
    console.log("API is working");
    res.json({"message": "API is working"});
  }
  catch(err){
    console.log(err);
  }
});

// Serve static files
app.use("/uploads", express.static("uploads"));


// Error handler middleware
app.use(errorMiddleware);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server is working on localhost:" + port);
});
