import mongoose from "mongoose";

import validator from 'validator';


interface IUser extends Document{
    _id:string;
    name:string;
    email:string;
    photo:string;
    role:"admin"|"user";
    gender:"male"|"female";
    dob:Date;
    createdAt:Date;
    updatedAt:Date;
    // virtual attribute
    age:number;
}

const schema = new mongoose.Schema({
    _id:{
        type:String,
        required: [true,"Please mention add"]
    },
    name:{
        type:String,
        required: [true,"Please add photo"]
    },
    email:{
        type:String,
        unique:[true,"email already exists"],
        required: [true,"Please enter your Email"],
        validate: validator.default.isEmail
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    },
    gender:{
        type:String,
        enum:["male","female"],
        required:[true,"Please enter your Gender"]
    },
    dob:{
        type:Date,
        required: [true,"Please enter your DOB"]
    }

},{timestamps:true}); // The timestamps option tells Mongoose to assign createdAt and updatedAt fields to your schema. The type assigned is Date.

// they are calculated on the go when .age is accessed on the record (only if the current record has dob field select in it (because below virtual attribute uses dob))
schema.virtual("age").get(function (){
    const today = new Date();
    const dob = this.dob;
    console.log(today,this.dob);
    let age = today.getFullYear() - dob.getFullYear();

    console.log(age);

    if(today.getMonth() <= dob.getMonth() && today.getDate() < dob.getDate())
        age--;

    return age;

})



export const User = mongoose.model<IUser>("User",schema);