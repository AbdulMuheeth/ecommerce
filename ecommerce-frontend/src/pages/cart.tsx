import React, { useEffect, useState } from 'react'
import Coupon from './admin/apps/coupon'
import { VscError } from 'react-icons/vsc'
import CartItem from '../components/cartItem'
import { Link } from 'react-router-dom'


const shippingCharges = 70
const subTotal = 1200
const tax = (subTotal*0.18)
const discount = 400
const total = shippingCharges + subTotal + tax - discount;

const cartItems = [

  {
    productId:"12",
    name:"prod1",
    price:20,
    stock:10,
    photo:"https://images.pexels.com/photos/2783873/pexels-photo-2783873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    quantity: 10,
    
  },
  {
    productId:"12",
    name:"prod1",
    price:20,
    stock:10,
    photo:"https://images.pexels.com/photos/2783873/pexels-photo-2783873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    quantity: 10,
    
  }

];

const Cart = () => {

  const [couponCode,setCouponCode] = useState<string>("");
  const [isValidCouponCode,setIsValidCouponCode]  = useState<boolean>(false);

  useEffect(()=>{
    // debouncing the coupon validation
    const timeOutHandler = setTimeout(()=>{
      if(Math.random()>0.5)
        setIsValidCouponCode(true)
      else
      setIsValidCouponCode(false)

    },1000);

    return () => {
      clearTimeout(timeOutHandler);
      setIsValidCouponCode(false); // makes coupon invalid directly 
    }

  },[couponCode])



  return (
    <div className='cart'>
      <main>

        {cartItems.length>0? (cartItems?.map((item,idx)=>{ 
          return <CartItem cartItem={item} key={idx+"cart Item"}/>
        })):(
          <h1>No Items Added</h1> 
        )}

      </main>
      <aside>
        <p>Subtotal: ${subTotal}</p>
        <p>Shipping Charges: ${subTotal}</p>
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