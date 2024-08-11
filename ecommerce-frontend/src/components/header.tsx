import React, { useState } from "react";

import {
  FaSearch,
  FaShoppingBag,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import { User } from "../types/types";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";

const Header = ({user}:{user:User|null}) => {

  // const user = { _id: "", role: "" };
  // const user = 
  const [isOpen,setIsOpen] = useState<boolean>(true);

  const logoutHandler = async () => {
    console.log("err");
    try{

      await signOut(auth);
      toast.success("signout successful")
      setIsOpen(false);
    }catch(err){
      toast.success("signout failed");
    }

  }

  return (
    <nav className="header">

      <Link className="navitem" onClick={()=>{setIsOpen(false)}} to={"/"} >Home</Link> {/* adding behaviour with the help of event delegation works properly only when element has not child elements */}
      <Link className="navitem" onClick={()=>{setIsOpen(false)}} to={"/search"}>
        <FaSearch data-closedialog/>
      </Link>
      <Link className="navitem" onClick={()=>{setIsOpen(false)}} to={"/cart"} data-closedialog>
        <FaShoppingBag />
      </Link>

      {user?._id ? (
        <>
          <button onClick={()=>setIsOpen((prev)=>!prev)}>
            <FaUser />
          </button>
          <dialog open={isOpen}>
            <div>
              {user?.role === "admin" && (
                <Link className="navitem" onClick={()=>{setIsOpen(false)}} to={"/admin/dashboard"} data-closedialog>Admin</Link>
              )}
              <Link className="navitem" onClick={()=>{setIsOpen(false)}} to={"/orders"} data-closedialog>Orders</Link>
              <button onClick={logoutHandler} >
                <FaSignOutAlt />
              </button>
            </div>
          </dialog>
        </>
      ) : (
        <Link to={"/login"}>
          <FaSignInAlt />
        </Link>
      )}
    </nav>
  );
};

export default Header;
