import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartReducerInitialStateType } from "../../types/reducer-types";
import { CartItems } from "../../types/types";

const initialState: CartReducerInitialStateType = {
    loading:false,
    subtotal:0,
    cartItems:[],
    tax:0,
    shippingCharges:0,
    discount:0,
    total:0,
    shippingInfo:{
        address:"",
        city:"",
        state:"",
        country:"",
        pinCode:""
    }
}

export const cartReducer = createSlice({
    name:"cartReducer",
    initialState,
    reducers:{
        addToCart: (state,action:PayloadAction<CartItems>) => {
            state.loading = true;

            const index = state.cartItems.findIndex((item)=> action.payload.productId === item.productId);

            if (index !== -1 ) state.cartItems[index] = action.payload
            else state.cartItems.push(action.payload);

            state.loading = false;
        },
        removeCartItem: (state,action:PayloadAction<string>) => {
            state.loading = true;
            state.cartItems = state.cartItems.filter((prod:CartItems)=>{
                return(prod.productId !== action.payload)
            });
            state.loading = false;
        },
        calculatePrice: (state) => {
            let subtotal = state.cartItems.reduce((acc,curr)=> acc+(curr.price * curr.quantity) ,0)

            state.subtotal = subtotal;
            state.shippingCharges = state.subtotal > 1000 ? 0 : 200;
            state.tax = Math.round(state.subtotal*0.18);
            state.total =  state.subtotal-state.discount+state.shippingCharges+state.tax
        },
        calculateDiscount: (state,action:PayloadAction<number>) => {
            state.discount = action.payload;
        }
    }
})

export const {addToCart,removeCartItem,calculatePrice,calculateDiscount} = cartReducer.actions