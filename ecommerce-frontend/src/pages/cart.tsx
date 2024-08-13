import React, { useEffect, useState } from 'react'
import Coupon from './admin/apps/coupon'
import { VscError } from 'react-icons/vsc'
import CartItemCard from '../components/cartItem'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { CartReducerInitialStateType } from '../types/reducer-types'
import { addToCart, calculateDiscount, calculatePrice, removeCartItem } from '../redux/reducers/cartReducer'
import { CartItems } from '../types/types'
import { server } from '../redux/store'
import axios from 'axios'


// const shippingCharges = 70
// const subTotal = 1200
// const tax = (subTotal*0.18)
// const discount = 400
// const total = shippingCharges + subTotal + tax - discount;
// const cartItems = [];

const Cart = () => {

  const {cartItems,subtotal:subTotal,discount,total,shippingCharges,tax} = useSelector((state:{cartReducer:CartReducerInitialStateType})=>state.cartReducer)

  const [couponCode,setCouponCode] = useState<string>("");
  const [isValidCouponCode,setIsValidCouponCode]  = useState<boolean>(false);

  const dispatch = useDispatch();

  const addToCartHandler =  function (cartItem:CartItems,val:string){
    
    if(val === 'reduce'){
      if(cartItem.quantity <= 1) return;
      
        dispatch(addToCart({...cartItem,quantity:cartItem.quantity-1}))
        // dispatch(calculatePrice());
      
    }
    else if(val === 'increase'){
      if(cartItem.quantity >= cartItem.stock) return
      dispatch(addToCart({...cartItem,quantity:cartItem.quantity+1}))
      // dispatch(calculatePrice());
    }

  }

  const removeHandler = function(productId:string){
    console.log(productId);
    dispatch(removeCartItem(productId));
    // dispatch(calculatePrice());
  }

  useEffect(()=>{
    // debouncing the coupon validation
    const src = axios.CancelToken.source() // similar to abort controller (cancels initiated fetch requests)

    const timeOutHandler = setTimeout(()=>{


      axios.get(`${server}/api/v1/payment/discount?coupon=${couponCode}`,{cancelToken:src.token})
        .then((res)=>{
          dispatch(calculateDiscount(res.data.discount));
          setIsValidCouponCode(true)
          dispatch(calculatePrice());
        })
        .catch(()=>{
          dispatch(calculateDiscount(0));
          setIsValidCouponCode(false)
          dispatch(calculatePrice());
        })

    },1000);

    return () => {
      clearTimeout(timeOutHandler);
      src.cancel(); // cancelling the axios.get call of coupon, when coupon value is changed
      setIsValidCouponCode(false); // makes coupon invalid directly 
    }

  },[couponCode])

  useEffect(()=>{
    dispatch(calculatePrice());
  },[cartItems])


  return (
    <div className='cart'>
      <main>

        {cartItems.length>0? (cartItems.map((item,idx)=>{ 
          return <CartItemCard cartItem={item} removeHandler={removeHandler} addToCartHandler={addToCartHandler} key={idx+"cart Item"}/>
        })):(
          <h1>No Items Added</h1> 
        )}

      </main>
      <aside>
        <p>Subtotal: ${subTotal}</p>
        <p>Shipping Charges: ${shippingCharges}</p>
        <p>Tax: ${tax}</p>
        <p>Discount:<em className='red'> - ${discount} </em></p>

        <p>Total: ${total}</p>

        <input type='text' placeholder="coupon code" value={couponCode} onChange={(e)=>setCouponCode(e.target.value)} />

        {
          couponCode && ( // checking couponCode value will make sure not show error on initial render
            isValidCouponCode ? (
              <span className='green'>${discount} off using the <code>{couponCode}</code></span>
            ):
            (
              <span className='red'> Invalid coupon <VscError/> </span>
            )
          )
        }

        {cartItems.length > 0 && <Link to="/shipping">Checkout</Link> }

      </aside>
    </div>
  )
}

export default Cart