import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AllCategoriesResponse,
  AllProductsResponse,
  MessageResponse,
  newProductRequest,
  ProductResponse,
  searchProductRequest,
  searchProductResponse,
  UpdateProductRequest,
} from "../../types/api-types";
import { server } from "../store";

export const productAPI = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`,
    // prepareHeaders:(headers)=>{ // gives error while creating new products which accepts formData
    //     // headers.set("Content-Type","application/json")
    //     return headers;
    // },
    credentials: "include",
  }),
  tagTypes: ["product"],
  endpoints: (builder) => ({
    // invalidating cache i.e. when new product is created than latest products in the home page aren't updated (to updated it we shld reload it) /// b/c rtk query has defaultly cached it (invalidated on reload) // to invalidate it manually we can use tags
    latestProducts: builder.query<AllProductsResponse, string>({
      query: () => "latest",
      providesTags: ["product"],
    }),
    allProducts: builder.query<AllProductsResponse, string>({
      query: (id) => `admin-products?id=${id}`,
      providesTags: ["product"],
    }),
    categories: builder.query<AllCategoriesResponse, string>({
      query: () => "categories",
      providesTags: ["product"],
    }),
    searchProducts: builder.query<searchProductResponse, searchProductRequest>({
      query: ({ search, page, price, category, sort }) => {
        let base = `/filtered?page=${page}`;
        if (search) base += `&search=${search}`;
        if (price) base += `&price=${price}`;
        if (category) base += `&category=${category}`;
        if (sort) base += `&sort=${sort}`;

        return base;
      },
      providesTags: ["product"],
    }),

    productDetails: builder.query<ProductResponse,string>({query:(id)=>id,providesTags:["product"]}),

    newProduct: builder.mutation<MessageResponse, newProductRequest>({
      query: ({ id, formData }) => ({
        url: `/new?id=${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),

    updateProduct: builder.mutation<MessageResponse,UpdateProductRequest>({
        query:({userId,productId,formData}) => ({
            url:`/${productId}?id=${userId}`,
            method:"PUT",
            body:formData
        }),
        invalidatesTags:["product"]
    }),

    deleteProduct: builder.mutation<MessageResponse,UpdateProductRequest>({
        query:({userId,productId}) => ({
            url:`/${productId}?id=${userId}`,
            method:"DELETE",
        }),
        invalidatesTags:["product"]
    })

  }),
});

export const useLatestProductsQuery: any = productAPI.useLatestProductsQuery;
export const useAllProductsQuery: any = productAPI.useAllProductsQuery;
export const useCategoriesQuery: any = productAPI.useCategoriesQuery;
export const useSearchProductsQuery: any = productAPI.useSearchProductsQuery;
export const useProductDetailsQuery: any = productAPI.useProductDetailsQuery;
export const useNewProductMutation: any = productAPI.useNewProductMutation;
export const useUpdateProductMutation: any = productAPI.useUpdateProductMutation;
export const useDeleteProductMutation: any = productAPI.useDeleteProductMutation;
