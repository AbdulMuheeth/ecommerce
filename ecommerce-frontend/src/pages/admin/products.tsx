import { ReactElement, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useAllProductsQuery } from "../../redux/apis/productAPI";
import toast from "react-hot-toast";
import { CustomError, Product } from "../../types/types";
import { server } from "../../redux/store";
import { UserReducerInitialStateType } from "../../types/reducer-types";
import { useSelector } from "react-redux";
import { userReducer } from "../../redux/reducers/userReducer";
import { Skeleton } from "../../components/loader";

interface DataType {
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Photo",
    accessor: "photo",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Stock",
    accessor: "stock",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const img =
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8&w=1000&q=804";

const img2 = "https://m.media-amazon.com/images/I/514T0SvwkHL._SL1500_.jpg";

const arr: Array<DataType> = [
  {
    photo: <img src={img} alt="Shoes" />,
    name: "Puma Shoes Air Jordan Cook Nigga 2023",
    price: 690,
    stock: 3,
    action: <Link to="/admin/product/sajknaskd">Manage</Link>,
  },

  {
    photo: <img src={img2} alt="Shoes" />,
    name: "Macbook",
    price: 232223,
    stock: 213,
    action: <Link to="/admin/product/sdaskdnkasjdn">Manage</Link>,
  },
];

const Products = () => {

  
  const [rows, setRows] = useState<DataType[]>(arr);
  const {user} = useSelector((state:{ userReducer:UserReducerInitialStateType} )=>{ 
    // console.log(state); // {userApi: {…}, userReducer: {…}, productApi: {…}}
    return state.userReducer
  })
  
  const {isError,error,isLoading,data} =  useAllProductsQuery("13")

  if(isError){
    const err = error as CustomError
    toast.error(err.data.message);
  }

  useEffect(()=>{
    if(data){
      setRows(data?.products.map((product:Product)=>(
        {
          photo:<img src={`${server}/${product.photo}`}/>,
          name: product.name,
          price: product.price,
          stock: product.stock,
          action: <Link to={`/admin/product/${product._id}`}>Manage</Link>
        }
      )))
    }
  },[data])


  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Products",
    rows.length > 6
  )();

  return (
    <>
    
    {isLoading?
      <Skeleton length={10}/>
    :
    <div className="admin-container">
      <AdminSidebar />
      <main>{Table}</main>
      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
    }
    </>
  );
};

export default Products;
