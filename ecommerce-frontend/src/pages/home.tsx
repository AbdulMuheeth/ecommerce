import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/productCard";
import { useLatestProductsQuery } from "../redux/apis/productAPI";
import { CartItems, Product } from "../types/types";
import toast from "react-hot-toast";
import Loader, { Skeleton } from "../components/loader";
import { useDispatch } from "react-redux";
import { addToCart, calculatePrice } from "../redux/reducers/cartReducer";

const Home = () => {

  const {data,isLoading,error} = useLatestProductsQuery("");
  const dispatch = useDispatch();


  // dispatch(cartItem)


  if(error){
    console.log(error)
      toast.error(error.data.message);
  }

  const addToCartHandler = (cartItem:CartItems) => {
      if(cartItem.stock <1) return toast.error("out of stock");

      dispatch(addToCart(cartItem));
      toast.success("Product Added to Cart")
  }

  return (
    <div className="home">
      <section></section>

      <h1>
        Latest Products
        <Link to="/search" className="findmore">
          more
        </Link>
      </h1>
      <main>
        
        { isLoading?
          <Skeleton width={"80vw"}/>
          // here data is getting any because we have used any for the api Query while getting reducers hook
          : data?.products.map((product:Product)=>(
            <ProductCard
              key={product._id}
              productId={product._id}
              name={product.name}
              price={product.price}
              stock={product.stock}
              handler={addToCartHandler}
              photo={product.photo}
            />
          ))
        }
      </main>
    </div>
  );
};

export default Home;
