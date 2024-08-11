import { Category, Product, User } from "./types"

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