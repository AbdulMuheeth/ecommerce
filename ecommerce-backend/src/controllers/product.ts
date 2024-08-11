import { TryCatch } from "../middlewares/error.js";
import { NextFunction, Request, Response } from "express";
import {
  BaseQuery,
  NewProductRequestBody,
  SearchRequestType,
} from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { faker } from "@faker-js/faker";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";

// Revalidate when new/update/delete of product & new Order
export const getLatestProducts = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    let products = [];

    if (myCache.has("latest-products"))
      products = JSON.parse(myCache.get("latest-products") as string);
    else {
      products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
      myCache.set("latest-products", JSON.stringify(products));
    }

    return res.status(200).json({
      success: true,
      products,
    });
  }
);

// Revalidate when new/update/delete of product & new Order
export const getAllCategories = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    let categories;

    if (myCache.has("all-categories"))
      categories = JSON.parse(myCache.get("all-categories") as string);
    else {
      categories = await Product.distinct("category"); // returns list of unqiue field values present in the Product collection
      myCache.set("all-categories", JSON.stringify(categories));
    }

    return res.status(200).json({
      success: true,
      categories,
    });
  }
);

// Revalidate when new/update/delete of product & new Order
export const getAdminProducts = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    let products;

    if (myCache.has("admin-products"))
      products = JSON.parse(myCache.get("admin-products") as string);
    else {
      products = await Product.find({});
      myCache.set("admin-products", JSON.stringify(products));
    }

    return res.status(200).json({
      success: true,
      products,
    });
  }
);

// Revalidate when new/update/delete of product & new Order
export const getSingleProduct = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    let product;

    if (myCache.has(`product-${id}`)) {
      product = JSON.parse(myCache.get(`product-${id}`) as string);
    } else {
      product = await Product.findById(id);
      if (!product)
        return next(new ErrorHandler("Invalid ID, product not found", 404));
      myCache.set(`product-${id}`, JSON.stringify(product));
    }

    return res.status(200).json({
      success: true,
      product,
    });
  }
);


export const newProduct = TryCatch(
  async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    // photo gets added in the folder (if uploaded in form) even before this controller starts running (b/c of multer middleware)
    const { name, price, stock, category } = req.body;
    const photo = req.file;

    if (!photo) return next(new ErrorHandler("Please add Photo", 400));

    if (!name || !price || !stock || !category) {
      // since photo is added in multer middleware we have to remove it when some error happens
      rm(photo.path, () => {
        console.log("Photo Deleted");
      });
      return next(new ErrorHandler("Please enter all field", 400));
    }

    await Product.create({
      name,
      price,
      stock,
      category: category.toLowerCase(),
      photo: photo.path,
    });

    invalidateCache({product:true, admin:true}); // after successful creation

    return res.status(201).json({
      success: true,
      message: "product created Successfully",
    });
  }
);

export const updateProduct = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    const product = await Product.findById(id);

    if (!product)
      return next(
        new ErrorHandler("Invalid ID, Product with given ID not found", 404)
      );

    if (photo) {
      // since photo is added in multer middleware we have to remove it when some error happens
      rm(product.photo, () => {
        console.log("Photo Deleted");
      });
      product.photo = photo.path;
    }

    if (name) product.name = name;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    await product.save();

    invalidateCache({product:true,productId:String(product._id),admin:true}); // after successful deletion

    return res.status(200).json({
      success: true,
      message: "product Updated Successfully",
    });
  }
);

export const deleteProduct = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const product = await Product.findById(id);

    rm(product?.photo!, () => {
      console.log("photo deleted DEL");
    });

    if (!product)
      return next(new ErrorHandler("Invalid ID, product not found", 404));

    await product.deleteOne();

    invalidateCache({product:true,productId:String(product._id),admin:true}); // after successful deletion

    return res.status(200).json({
      success: true,
      message: "product deleted Successfully",
    });
  }
);

export const getFilteredProducts = TryCatch(
  async (
    req: Request<{}, {}, {}, SearchRequestType>,
    res: Response,
    next: NextFunction
  ) => {
    const { search, sort, price, category } = req.query;
    const page = Number(req.query.page) || 1;

    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;

    //   { // total base Query, to avoid undefined filter values we will be adding properties one by one
    //     name:{
    //         $regex:search, // searches for pattern, rather than a specific word
    //         $options:"i" // ignores cases
    //     },
    //     price:{
    //         $lte:Number(price), // less than price
    //     },
    //     category,
    //   }

    const baseQuery: BaseQuery = {};

    if (search)
      baseQuery.name = {
        // if types is not mentioned then it will give error
        $regex: search,
        $options: "i",
      };

    if (price) {
      baseQuery.price = {
        $lte: Number(price), // less than price
      };
    }

    if (category) baseQuery.category = category;

    const productsInPage = Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const filteredOnlyProducts = Product.find(baseQuery);

    const [products, filteredProducts] = await Promise.all([
      productsInPage,
      filteredOnlyProducts,
    ]);

    const totalPages = Math.ceil(filteredProducts.length / limit);

    return res.status(200).json({
      success: true,
      products,
      totalPages,
    });
  }
);

// const genereateRandomProducts = async(count:number=10)=>{
//   const products = [];

//   for(let i=0;i<count;i++){
//     const product = {
//       name:faker.commerce.productName(),
//       photo:"uploads\\5125a599-23fc-42cb-8f41-5287014d0d0c.jpg",
//       price: faker.commerce.price({min:1500,max:80000,dec:0}),
//       stock: faker.commerce.price({min:0,max:100,dec:0}),
//       category:faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updateAt: new Date(faker.date.recent()),
//       __v:0,
//     }

//     products.push(product)
//   }

//   await Product.create(products);

//   console.log({success:true});
// }

// const deleteRandomProducts = async(count:number=10)=>{
//   const products = await Product.find({}).skip(2);

//   console.log(products);
//   for(let i=0;i<products.length;i++){
//     const product = products[i];
//     console.log(product);
//     await product.deleteOne();
//   }

//   console.log({success:true});
// }
