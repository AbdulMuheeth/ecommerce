import { Product, User } from "./types"

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