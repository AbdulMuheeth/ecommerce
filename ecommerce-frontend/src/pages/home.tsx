import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/productCard";
import { useLatestProductsQuery } from "../redux/apis/productAPI";
import { Product } from "../types/types";
import toast from "react-hot-toast";
import Loader, { Skeleton } from "../components/loader";

const Home = () => {

  const {data,isLoading,error} = useLatestProductsQuery("");

  if(error){
    console.log(error)
      toast.error(error.data.message);
  }

  const addToCartHandler = ()=>{

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
