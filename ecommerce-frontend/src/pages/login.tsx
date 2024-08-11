import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import   { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase";
import { useLoginMutation } from "../redux/apis/userAPI";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponse } from "../types/api-types";

const Login = () => {
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");

  const [login] = useLoginMutation();
  // const {data:testValue} = useTestQuery();

  const loginHandler = async() => {
    try{
      const provider = new GoogleAuthProvider();
      const {user} = await signInWithPopup(auth,provider) // this will sign in the user and store it in firebase // to store user details in mongoDB we are retrieving user after signing in

      console.log(user);
      // console.log("I am called!")
      // let value = await fetch(import.meta.env.VITE_SERVER,{
      //   method:"GET",
      //   // mode:"no-cors",
      // })
      // console.log(value);

      // console.log(value.json().then((res) => res));

      // console.log("I am called!");
      // console.log(testValue);
      
      const res = await login({
        name:user.displayName,
        email:user.email,
        photo:user.photoURL,
        gender,
        role:"user",
        dob:date,
        _id:user.uid
      })

      console.log(res);

      if("data" in res){
        toast.success(res.data.message);
      }else{
        const error = res.error as FetchBaseQueryError;
        const message = error.data as MessageResponse;
        toast.error(message.message);
      }

    }
    catch(error){
      console.log(error);
      toast.error("Sign In Failed")
    }
  }

  return (
    <div className="login">
      <main>
        <h1> Login </h1>
        <div>
          <label>Gender</label>
          <select
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value={""}>Select Gender</option>
            <option value={"male"}>Male</option>
            <option value={"female"}>Female</option>
          </select>
        </div>
        <div>
          <label>Date of Birth</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <p> Already Signed In Once</p>
          <button onClick={loginHandler}>
            <FcGoogle /> <span>Sign in with Google</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
