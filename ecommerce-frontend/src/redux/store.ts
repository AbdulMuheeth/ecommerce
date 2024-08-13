import { configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./apis/userAPI";
import { userReducer } from "./reducers/userReducer";
import { productAPI } from "./apis/productAPI";
import { cartReducer } from "./reducers/cartReducer";

export const server = import.meta.env.VITE_SERVER
// console.log("ur;",import.meta.env.BASE_URL); //returns : /

export const store = configureStore({
  reducer: {
    [userAPI.reducerPath]: userAPI.reducer,
    [userReducer.name]: userReducer.reducer,
    [productAPI.reducerPath]: productAPI.reducer,
    [cartReducer.name]: cartReducer.reducer,
  },
  middleware: (getDefaultMiddleware) => // what will this middleware do?
    // This middleware is responsible for handling API requests and responses, intercepting actions related to API calls, and performing tasks such as making HTTP requests, handling caching, and dispatching appropriate actions based on the API response.
    // By including userAPI.middleware in the middleware chain, the store gains the ability to handle API-related actions and perform necessary side effects, such as making API calls and updating the store with the response data
    getDefaultMiddleware().concat(userAPI.middleware,productAPI.middleware),
  // middleware: (mid) => [...mid(),userAPI.middleware],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;