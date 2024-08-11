import express from "express";
import { singleUpload } from "../middlewares/multer.js";
import {
  deleteProduct,
  getAdminProducts,
  getAllCategories,
  getFilteredProducts,
  getLatestProducts,
  getSingleProduct,
  newProduct,
  updateProduct,
} from "../controllers/product.js";
import { adminOnly } from "../middlewares/auth.js";
// import { invalidateCache } from "../utils/features.js";

const app = express.Router();
// const productCacheInvalidate = () => invalidateCache({product:true}); // we can add it as middleware but we need to do it after the controller function, we delete it only after successfull creation/updation/deletion of product

//to create new Product - api/v1/product/new
app.post("/new", adminOnly, singleUpload, newProduct);

// to get all filtered products - api/v1/product/getLatest
app.get("/filtered", getFilteredProducts);

// to get last 5 products - api/v1/product/getLatest
app.get("/latest", getLatestProducts);

// to get all categories - api/v1/product/getCategories
app.get("/categories", getAllCategories);

// to get all products - api/v1/product/getCategories
app.get("/admin-products", adminOnly, getAdminProducts);

// to get all products,delete,update - api/v1/product/..
app
  .route("/:id")
  .get(getSingleProduct)
  .put(adminOnly,singleUpload, updateProduct)
  .delete(adminOnly,deleteProduct);

export default app;
