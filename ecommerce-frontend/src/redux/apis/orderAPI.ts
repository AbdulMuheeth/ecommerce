import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllOrdersResponse, MessageResponse, NewOrderRequest, OrderDetailResponse, UpdateOrderRequest } from "../../types/api-types";
import { server } from "../store";
import OrderDetails from "../../pages/orderDetails";


export const orderAPI = createApi({
    reducerPath:"orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/order/`,
    }),
    tagTypes:['orders'],
    endpoints:(builder) => ({
        newOrder: builder.mutation<MessageResponse,NewOrderRequest>({
            query:(order)=>({
                url:"new",
                method:"POST",
                body:order
            }),
            invalidatesTags:['orders']
        }),
        myOrders: builder.query<AllOrdersResponse,string>({
            query:(id) => `my?id=${id}`,
            providesTags:['orders']
        }),
        allOrders: builder.query<AllOrdersResponse,string>({
            query:(id) => `all?id=${id}`,
            providesTags:['orders']
        }),
        OrderDetails: builder.query<OrderDetailResponse,string>({
            query:(id) => id,
            providesTags:['orders']
        }),
        ProcessOrder: builder.mutation<MessageResponse,UpdateOrderRequest>({
            query:({orderId,userId})=>({
                url:`${orderId}?id=${userId}`,
                method:"PUT",
            }),
            invalidatesTags:['orders']
        }),
        DeleteOrder: builder.mutation<MessageResponse,UpdateOrderRequest>({
            query:({orderId,userId})=>({
                url:`${orderId}?id=${userId}`,
                method:"DELETE",
            }),
            invalidatesTags:['orders']
        }),
        
    })
})

export const useNewOrderMutation:any = orderAPI.useNewOrderMutation;
export const useMyOrdersQuery:any = orderAPI.useMyOrdersQuery;
export const useAllOrdersQuery:any = orderAPI.useAllOrdersQuery;
export const useOrderDetailsQuery:any = orderAPI.useOrderDetailsQuery;
export const useProcessOrderMutation:any = orderAPI.useProcessOrderMutation;
export const useDeleteOrderMutation:any = orderAPI.useDeleteOrderMutation;

// export const useNewOrderMutation:any = orderAPI.endpoints.newOrder.useMutation;