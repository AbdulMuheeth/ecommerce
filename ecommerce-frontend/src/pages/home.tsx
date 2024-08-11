import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/productCard";
import { useLatestProductsQuery } from "../redux/apis/productAPI";

const Home = () => {

  const {} = useLatestProductsQuery("");

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
        <ProductCard
          productId="12"
          name="prod1"
          price={20}
          stock={1}
          handler={() => {}}
          photo="https://images.pexels.com/photos/2783873/pexels-photo-2783873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        ></ProductCard>
      </main>
    </div>
  );
};

export default Home;
