import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import Loader from "./components/loader";
import Header from "./components/header";
import { Toaster } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { getUser, useGetUserQuery, userAPI } from "./redux/apis/userAPI";
import { userExists, userNotExists } from "./redux/reducers/userReducer";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./redux/store";
import { QuerySubState } from "@reduxjs/toolkit/query";
import { User } from "./types/types";
import { GetUserResponse } from "./types/api-types";
import { UserReducerInitialStateType } from "./types/reducer-types";
import ProtectedRoute from "./components/protectedRoute";
import OrderDetails from "./pages/orderDetails";
import NotFound from "./pages/notFound";
// import "./styles/app.scss";


// import Cart from "./pages/cart"; // Component which are declared here are loaded when default localhost url is loaded // to make load only when the route path is called then we need to lazy load the components
const Home = lazy(() => import("./pages/home")); // dynamically importing the values
const Search = lazy(() => import("./pages/search"));
const Cart = lazy(() => import("./pages/cart"));
const Shipping = lazy(() => import("./pages/shipping"));
const Login = lazy(() => import("./pages/login"));
const Orders = lazy(() => import("./pages/orders"));

// admin
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/products"));
const Customers = lazy(() => import("./pages/admin/customers"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const Barcharts = lazy(() => import("./pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/stopwatch"));
const Toss = lazy(() => import("./pages/admin/apps/toss"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const ProductManagement = lazy(
  () => import("./pages/admin/management/productmanagement")
);
const TransactionManagement = lazy(
  () => import("./pages/admin/management/transactionmanagement")
);

const App = () => {
  // const [userID,setUserID] = useState(""); // using rtk query to get results 🙏
  // const dispatch = useDispatch<AppDispatch>() // using rtk query to get results 🙏
  // let data = useSelector((state:RootState)=> state.userApi.queries[`getUser("${userID}")`]?.data?.user) // using rtk query to get results 🙏 // initially undefined once the action is dispatched then the useSelector can retreive the data

  // separate fetch query
  const { user, loading } = useSelector(
    (state: { userReducer: UserReducerInitialStateType }) => state.userReducer
  );

  const dispatch = useDispatch();

  // console.log("user",user)

  useEffect(() => {
    // if(data) // using rtk query to get results 🙏
    // {
    //   console.log("data---",data);
    //   // dispatch(userExists(data))
    //   return ()=>{}
    // }

    // 
    // firebase creates cookie with data of firebase user on successfull login persistent on reload
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Here user will be of User of Firebase (not our custom type)

      if (firebaseUser) {
        // console.log("loggedIN")

        // const {data:userLocal} =  await useGetUserQuery(user.uid); // can't use this because it use hook, hook shld be called only directly inside a function (not inside otherhook)

        // different fetch api // useful if we want to store data separately (in redux in other slice ) rather than in the API slice itself
        const { user: userLocal } = await getUser(firebaseUser.uid);
        // console.log("local user",userLocal)
        dispatch(userExists(userLocal));

        // ------------------------------------------------

        // setUserID(user.uid) // using rtk query to get results 🙏
        // dispatch(userAPI.endpoints.getUser.initiate(user.uid)) //dispatching action to get user query  // using rtk query to get results 🙏
        // console.log(data); // using rtk query to get results 🙏
      }
      else{
        dispatch(userNotExists())
      }
    });

    return ()=>unsubscribe();
  }, [dispatch]); // using rtk query to get results 🙏 // data should be added as the dependency if we are using rtk query to fetch results

  // console.log(user?true:false)
  // console.log(!!user)

  if (loading){
    return <Loader/>;
  }

  return (
    <Router>
      <Header user={user} />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/cart" element={<Cart />} />

          {/* Not loggedin route */}
          {/* defines the Children  */}
          <Route
            path="/login"
            element={
              <ProtectedRoute isAuthenticated={!user} isLoading={loading}> 
                <Login />
              </ProtectedRoute>
            }
          />

          {/* loggedin route */}
          <Route 
            element={<ProtectedRoute isAuthenticated={!!user}  isLoading={loading}/>}
          >{/* defines the Outlet - matching children component is rendered */}
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
          </Route>

          {/*admin route*/}
          <Route
          element={
            <ProtectedRoute isAuthenticated={true} adminRoute={true} isAdmin={user?.role === "admin"} isLoading={loading} />
          }
          >{/* defines the Outlet - matching children component is rendered */}
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/product" element={<Products />} />
            <Route path="/admin/customer" element={<Customers />} />
            <Route path="/admin/transaction" element={<Transaction />} />
            {/* Charts */}
            <Route path="/admin/chart/bar" element={<Barcharts />} />
            <Route path="/admin/chart/pie" element={<Piecharts />} />
            <Route path="/admin/chart/line" element={<Linecharts />} />
            {/* Apps */}
            <Route path="/admin/app/coupon" element={<Coupon />} />
            <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
            <Route path="/admin/app/toss" element={<Toss />} />

            {/* Management */}
            <Route path="/admin/product/new" element={<NewProduct />} />

            <Route path="/admin/product/:id" element={<ProductManagement />} />

            <Route
              path="/admin/transaction/:id"
              element={<TransactionManagement />}
            />
          </Route>

          <Route
              path="*"
              element={<NotFound/>}
          />
        </Routes>
      </Suspense>
      <Toaster position="bottom-center" />
    </Router>
  );
};

export default App;
