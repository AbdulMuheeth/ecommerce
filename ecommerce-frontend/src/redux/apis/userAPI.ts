import { createApi, fetchBaseQuery, TypedUseQuery } from "@reduxjs/toolkit/query/react";
// import { server } from "../store";
import axios from "axios";
import { GetUserResponse, MessageResponse } from "../../types/api-types";
import { User } from "../../types/types";

export const userAPI = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://localhost:3000/api/v1/user`,
    prepareHeaders: (headers) => {
      // Add any custom headers if needed
      headers.set("Content-Type", "application/json");
      return headers;
    },
    credentials: "include", // Include credentials (cookies) with requests if needed
  }),
  endpoints: (builder) => ({
    login: builder.mutation<MessageResponse, User>({ // <responsedefinition,type_of_received>
      query: (user) => ({
        url: "/new?id=13",
        method: "POST",
        body: user,
      }),
    }),
    getUser: builder.query<GetUserResponse,string>({ // here string defines the argument type which will be received
      query:(id) => `/${id}?id=13` // OR
      // query:(id)=>({
      //   url:`/${id}?id=13`
      // })
    })

    // test: builder.query<any, void>({
    //     query: () => "test",
    // }),
  }),
});


export const getUser = async function(id:string){
  try{
    const {data:user} = await axios.get("http://localhost:3000/api/v1/user/"+id+"?id=13");
    return user;
  }
  catch(err){
    console.log(err);
  }
}

export const useLoginMutation: any = userAPI.useLoginMutation;
// export const useTestQuery: any = userAPI.useTestQuery;
export const useGetUserQuery: any = userAPI.useGetUserQuery;