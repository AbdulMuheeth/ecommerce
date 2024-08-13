import { CartItems, ShippingInfo, User } from "./types";

export type UserReducerInitialStateType = {
    user: User | null;
    loading: boolean;
}

export type CartReducerInitialStateType = {
    loading:boolean,
    cartItems:CartItems[],
    subtotal:number,
    tax:number,
    shippingCharges:number,
    discount:number,
    total:number,
    shippingInfo:ShippingInfo
}