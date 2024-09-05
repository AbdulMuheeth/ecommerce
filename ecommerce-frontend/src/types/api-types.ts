import { CartItems, Category, OrderItems, OrderType, Product, ShippingInfo, User } from "./types"

export type MessageResponse = {
    success:boolean,
    message: string,
}

export type GetUserResponse = {
    success:boolean,
    user:User,
}

export type AllProductsResponse = {
    success:boolean,
    products:Product[]
}

export type AllCategoriesResponse = {
    success:boolean,
    categories:Category[]
}

export type searchProductResponse = AllProductsResponse & {
    totalPage:number
}

export type searchProductRequest = {
    price: number,
    category:string,
    search:string,
    page:number,
    sort:string,
}

export type newProductRequest = {
    id:string,
    formData: FormData
}

export type UpdateProductRequest = {
    userId:string,
    productId:string,
    formData: FormData
}

export type ProductResponse = {
    success:boolean,
    product: Product
}

export type NewOrderRequest = {
    shippingInfo:ShippingInfo,
    total:number,
    subtotal:number,
    tax:number,
    shippingCharges:number,
    orderItems:CartItems[], // here we are considering CartItems over the created OrderItems type b/c orderItems has _id created by mongoDb init (which can't be present order item before creation of order)
    discount:number,
    user:string,
}

export type AllOrdersResponse = {
    success:boolean,
    products:OrderType[],
}
export type OrderDetailResponse = {
    success:boolean,
    order:OrderType,
}

export type UpdateOrderRequest = {
    userId:string,
    orderId:string,
}
