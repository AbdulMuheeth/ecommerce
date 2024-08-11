import React from 'react'
import { FaPlus } from 'react-icons/fa'

type ProductProps = {
    productId: string,
    photo:string,
    price:number,
    name:string,
    stock:number,
    handler(): void
}

// var server = "demo";
const ProductCard = ({productId,photo,price,name,stock,handler}:ProductProps) => {
  return (
    <div className="productcard" key={productId}>
        <img src={`${photo}`} alt={`img:${name}`} />
        <p>{name}</p>
        <span>${price}</span>

        <div> {/* will be used to overlay*/}
            <button onClick={()=>handler()}><FaPlus/></button>
        </div>
    </div>
  )
}

export default ProductCard