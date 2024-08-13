import React from 'react'
import { FaPlus } from 'react-icons/fa'
import { server } from '../redux/store'
import { CartItems } from '../types/types'


type ProductProps = {
    productId: string,
    photo:string,
    price:number,
    name:string,
    stock:number,
    handler: (cartItem: CartItems) => string | undefined,
}

// var server = ;
const ProductCard = ({productId,photo,price,name,stock,handler}:ProductProps) => {
  
  return (
    <div className="productcard" key={productId}>
        <img src={`${server}/${photo}`} alt={`img:${name}`} />
        <p>{name}</p>
        <span>${price}</span>

        <div> {/* will be used to overlay*/}
            <button onClick={()=>handler({photo,price,name,stock,productId,quantity:1})}><FaPlus/></button>
        </div>
    </div>
  )
}

export default ProductCard