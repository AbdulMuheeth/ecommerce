import React, { useState } from "react";
import ProductCard from "../components/productCard";
import {
  useCategoriesQuery,
  useSearchProductsQuery,
} from "../redux/apis/productAPI";
import { CartItems, Category, CustomError, Product } from "../types/types";
import toast from "react-hot-toast";
import { Skeleton } from "../components/loader";
import { server } from "../redux/store";
import { addToCart } from "../redux/reducers/cartReducer";
import { useDispatch } from "react-redux";

const Search = () => {

  const {
    isLoading: categoryLoading,
    isError,
    error,
    data: CategoryResponse,
  } = useCategoriesQuery("");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();
  

  const {
    isLoading: productLoading,
    isError: isProductError,
    error: productError,
    data: productResponse,
  } = useSearchProductsQuery({
    sort,
    price: maxPrice,
    category,
    page,
    search,
  });

  console.log(productResponse);

  if (isError || isProductError) {
    const err = (error || productError) as CustomError;
    toast.error(err.data.message);
  }

  // function addToCartHandler(): void {}

  const addToCartHandler = (cartItem:CartItems) => {
    if(cartItem.stock <1) return toast.error("out of stock");

    dispatch(addToCart(cartItem));
    toast.success("Product Added to Cart")
}

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
            {categoryLoading === false &&
              CategoryResponse.categories.map((category: Category) => (
                <option key={category} value={category}>{category.toUpperCase()}</option>
              ))}
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
          {productLoading ? (
            <Skeleton length={10} />
            ) : (
            productResponse?.products.map((product: Product) => (
              <ProductCard
                key={product._id}
                productId={product._id}
                name={product.name}
                price={product.price}
                stock={product.stock}
                handler={addToCartHandler}
                photo={`${product.photo}`}
              />
            ))
          )}
        </div>

        {productResponse?.totalPages > 1 ? (
          <article>
            <button
              disabled={isPrevPage}
              onClick={() => {
                setPage((prev) => prev - 1);
              }}
            >
              prev
            </button>
            <span>
              {page} of {productResponse.totalPages}
            </span>
            <button
              disabled={isNextPage}
              onClick={() => {
                setPage((prev) => prev + 1);
              }}
            >
              next
            </button>
          </article>
        ) : (
          ""
        )}
      </main>
    </div>
  );
};

export default Search;
