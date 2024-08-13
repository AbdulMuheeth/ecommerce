import React from 'react'
import { FaTrash } from 'react-icons/fa';
import {Link} from 'react-router-dom';
import { server } from '../redux/store';
import { addToCart, removeCartItem } from '../redux/reducers/cartReducer';
import { CartItems } from '../types/types';
import { useDispatch } from 'react-redux';

type CartItemType = {
    cartItem: CartItems
    addToCartHandler: (cartItem: any, val: string) => void,
    removeHandler:(productId: string) => void
}

const CartItem = ({cartItem,addToCartHandler,removeHandler}:CartItemType) => {

  
  const {productId,name,price,photo,quantity} = cartItem;
  

  return (
    <div className="cartItem">
      <img src={`${server}/${photo}`} alt={name} />
      <article>
        <Link to={`/product/${productId}`}>{name}</Link>
        <span>${price}</span>
      </article>

      <div>
        <button onClick={()=>addToCartHandler(cartItem,"reduce")}>-</button>
        <p>{quantity}</p>
        <button onClick={()=>addToCartHandler(cartItem,"increase")}>+</button>
      </div>

      <button onClick={()=>removeHandler(productId)}>
        <FaTrash/>
      </button>
 
    </div>
  )
}

export default CartItem