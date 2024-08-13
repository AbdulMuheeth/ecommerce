export type User = {
    _id:string,
    name:string,
    photo:string,
    email:string,
    role:string,
    gender:string,
    dob:string,
}

export type Product = {
    name:string,
    price:number,
    stock:number,
    category:string,
    photo:string,
    _id:string
}

export type Category = string;

export interface CustomError{
    status:number,
    data:{
        message:string,
        success:boolean
    }
}

export type ShippingInfo = {
    address:string,
    city:string,
    state:string,
    country:string,
    pinCode:string,
}

export type CartItems = {
    productId: string,
    photo: string,
    name:string,
    price:number,
    quantity:number,
    stock:number,
}