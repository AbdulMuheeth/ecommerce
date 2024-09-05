import React, { ReactElement, useEffect, useState } from "react";
import TableHOC from "../components/admin/TableHOC";
import { Column } from "react-table";
import {Link} from 'react-router-dom';
import { useSelector } from "react-redux";
import { UserReducerInitialStateType } from "../types/reducer-types";
import { useMyOrdersQuery, useOrderDetailsQuery } from "../redux/apis/orderAPI";
import { CustomError, OrderType } from "../types/types";
import toast from "react-hot-toast";

type DataType = {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: ReactElement;
  action: ReactElement;
};

const column: Column<DataType>[] = [
  {
    Header: "ID",
    accessor: "_id",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Orders = () => {

  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialStateType }) => {
      return state.userReducer;
    }
  );

  console.log(user);
  const { isError, error, isLoading, data } = useMyOrdersQuery("13"); //user?._id

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  const [rows,setRows] = useState<DataType[]>([])

  useEffect(() => {
    console.log(data);
    if (data) {
      setRows(
        data?.orders.map((order: OrderType) => ({
          _id: order._id,
          user: order.user.name,
          amount: order.total,
          discount: order.discount,
          quantity: order.orderItems.length,
          status: (
            <span
              className={
                order.status === "processing"
                  ? "red"
                  : order.status === "shipped"
                  ? "green"
                  : "purple"
              }
            >
              {order.status}
            </span>
          ),
          action: <Link to={`/admin/transaction/${order._id}`}>Manage</Link>,
        }))
      );
    }
  }, [data]);


  const Table = TableHOC<DataType>(
    column,
    rows,
    "dashboard-product-box",
    "Orders",
    rows.length > 6 //show pagination
  )();

  return (
    <div className="container">
      <h1>My Orders</h1>
      {Table}
    </div>
  );

};

export default Orders;
