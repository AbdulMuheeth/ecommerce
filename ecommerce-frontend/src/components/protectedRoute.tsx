import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { Navigate,Outlet } from "react-router-dom";
import { UserReducerInitialState } from "../types/reducer-types";
import Loader from "./loader";

interface Props {
  children?: ReactElement;
  isAuthenticated: boolean;
  adminRoute?: boolean;
  isAdmin?: boolean;
  redirect?: string;
  isLoading?:boolean
}

const ProtectedRoute = ({
  isAuthenticated,
  children,
  adminRoute,
  isLoading,
  isAdmin,
  redirect = "/",
}: Props) => {

// using this to make sure the directly entered url (which are protected also to work) // but its still not working  
const { user, loading } = useSelector((state:{userReducer:UserReducerInitialState}) => state.userReducer);
console.log(user);

  if (loading) {
    return <Loader />;
  }

    console.log({isAuthenticated,
        children,
        adminRoute,
        isAdmin,
        redirect})

    // if (!user) return <Navigate to={redirect} />;
    // console.log(children)
    if(adminRoute && user?.role!=="admin") return <Navigate to={redirect} />;
  
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
