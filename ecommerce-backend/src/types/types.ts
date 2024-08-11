import { NextFunction, Request, Response } from "express";
import { Document } from "mongoose";

export interface NewUserRequestBody {
  name: string;
  email: string;
  photo: string;
  gender: string;
  _id: string;
  dob: string;
}

export interface NewProductRequestBody{
  name: string,
  photo:string,
  price:number,
  stock:number,
  category:string,
}

  export type ControllerType = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void | Response<any, Record<string, any>>>;


export type SearchRequestType = {
  search?: string,
  price?: string,
  category?: string,
  sort?: string,
  page?: string,
}

export type BaseQuery = {
  name?:{
    $regex:string,
    $options:string,
  },
  price?:{
    $lte:number
  },
  category?:string
}

export type InvalidateCacheProps = {
  product?:boolean,
  order?:boolean,
  admin?:boolean,
  userId?:string,
  orderId?:string,
  productId?:string | string[]
}

export type ShippingInfoType = {
  address:string,
  city:string,
  state:string,
  country:string,
  pinCode:string,
}

export type OrderItemType = {
  name:string,
  photo:number,
  price:number,
  quantity:number,
  productId:string,
}

export interface NewOrderRequestBody {
  shippingInfo:{};
  user:string,
  subtotal:number,
  tax:number,
  shippingCharges:number,
  discount:number,
  total:number,
  orderItems:OrderItemType[];
}

export interface myDocument extends Document{
  createdAt:Date;
  discount?:number;
  total?:number;
}

export type BarChartData = {
  length: number;
  docArr: myDocument[];
  today:Date;
  property?:"total"|"discount";
}