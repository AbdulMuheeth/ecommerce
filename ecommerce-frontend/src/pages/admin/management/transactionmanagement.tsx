import { FaTrash } from "react-icons/fa";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useEffect, useState } from "react";
import { OrderItems, OrderType } from "../../../types/types";
import { server } from "../../../redux/store";
import { UserReducerInitialStateType } from "../../../types/reducer-types";
import { useSelector } from "react-redux";
import { useDeleteOrderMutation, useOrderDetailsQuery, useProcessOrderMutation } from "../../../redux/apis/orderAPI";
import { Skeleton } from "../../../components/loader";
import toast from "react-hot-toast";
import { responseToast } from "../../../utils/features";

const defaultData: OrderType = {
  shippingInfo: {
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: 0,
  },
  status: "",
  subtotal: 0,
  discount: 0,
  shippingCharges: 0,
  tax: 0,
  total: 0,
  orderItems: [],
  user: { _id: "", name: "" },
  _id: "",
};

const TransactionManagement = () => {

  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialStateType }) => {
      return state.userReducer;
    }
  );

  const [updateOrder] = useProcessOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const params = useParams();
  const navigate = useNavigate();

  console.log({
    orderId: params.id,
    userId: "13",
  });

  console.log({id:params._id});

  const { isError,error,isLoading, data } = useOrderDetailsQuery(params.id!);
  console.log(isError,data)
  console.log(error)

  let {
    shippingInfo: { address, city, state, country, pinCode },
    orderItems,
    user: { name },
    status,
    tax,
    subtotal,
    total,
    discount,
    shippingCharges,
  } = data?.order || defaultData; // this will consider only shippingInfo from data.order or default data

  // if (isError) return <Navigate to={"/404"} />;

  const deleteHandler = async () => {
    const res = await deleteOrder({
      userId: user?._id!,
      orderId:data?.order._id!
    })
    responseToast(res,navigate,"/admin/transaction")
  };

  const updateHandler = async ()=> {
    const res = await updateOrder({
      userId: user?._id!,
      orderId:data?.order._id!
    })
    responseToast(res,navigate,"/admin/transaction")
  };


  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
            <section
              style={{
                padding: "2rem",
              }}
            >
              <h2>Order Items</h2>

              {orderItems.map((i:OrderItems) => (
                <ProductCard
                  key={i._id}
                  name={i.name}
                  photo={`${server}/${i.photo}`}
                  productId={i.productId}
                  _id={i._id}
                  quantity={i.quantity}
                  price={i.price}
                />
              ))}
            </section>

            <article className="shipping-info-card">
              <button className="product-delete-btn" onClick={deleteHandler}>
                <FaTrash />
              </button>
              <h1>Order Info</h1>
              <h5>User Info</h5>
              <p>Name: {name}</p>
              <p>
                Address:{" "}
                {`${address}, ${city}, ${state}, ${country} ${pinCode}`}
              </p>
              <h5>Amount Info</h5>
              <p>Subtotal: {subtotal}</p>
              <p>Shipping Charges: {shippingCharges}</p>
              <p>Tax: {tax}</p>
              <p>Discount: {discount}</p>
              <p>Total: {total}</p>

              <h5>Status Info</h5>
              <p>
                Status:{" "}
                <span
                  className={
                    status === "Delivered"
                      ? "purple"
                      : status === "Shipped"
                      ? "green"
                      : "red"
                  }
                >
                  {status}
                </span>
              </p>
              <button className="shipping-btn" onClick={updateHandler}>
                Process Status
              </button>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

const ProductCard = ({
  name,
  photo,
  price,
  quantity,
  productId,
}: OrderItems) => (
  <div className="transaction-product-card">
    <img src={photo} alt={name} />
    <Link to={`/product/${productId}`}>{name}</Link>
    <span>
      ₹{price} X {quantity} = ₹{price * quantity}
    </span>
  </div>
);

export default TransactionManagement;
