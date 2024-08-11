import React, { useState } from "react";
import ProductCard from "../components/productCard";

const Search = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(0);

  function addToCartHandler(): void {}

  const isNextPage = true;
  const isPrevPage = true;


  return (
    <div className="productSearchPage">
      <aside>
        <h2>Filters</h2>

        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value={""}>None</option>
            <option value={"asc"}>Price (low to high)</option>
            <option value={"dsc"}>Price (high to low)</option>
          </select>
        </div>

        <div>
          <h4>Max Price:{maxPrice || ""}</h4>
          <input
            type="range"
            value={maxPrice}
            min={100}
            max={100000}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        <div>
          <h4>Category</h4>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value={""}>None</option>
            <option value={"s1"}>Sample1</option>
            <option value={"s2"}>Sample2</option>
          </select>
        </div>
      </aside>
      <main>
        <h1> Products </h1>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="searchProductList">
          <ProductCard
            productId="12"
            name="prod1"
            price={20}
            stock={1}
            handler={addToCartHandler}
            photo="https://images.pexels.com/photos/2783873/pexels-photo-2783873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          />
        </div>

        <article>
          <button disabled={isPrevPage} onClick={()=>{setPage(prev => (prev-1))}}>prev</button>
          <span>
            {page} of {4}
          </span>
          <button disabled={isNextPage} onClick={()=>{setPage(prev => (prev+1))}}>next</button>
        </article>
      </main>
    </div>
  );
};

export default Search;
