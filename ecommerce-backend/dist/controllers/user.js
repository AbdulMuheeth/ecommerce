import { User } from '../models/user.js';
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "../middlewares/error.js";
// handles the login and signup in a single page
export const newUser = TryCatch(async (req, res, next) => {
    // return next(new ErrorHandler("My custtom Err",402));
    // try{
    // throw new Error("mfds")
    const { name, email, dob, _id, gender, photo } = req.body;
    let user = await User.findById(_id);
    if (user) // checking if user with current id is present in DB or not
        return res.status(200).json({
            success: true,
            message: "Welcome, " + name
        });
    if (!_id || !name || !email || !dob || !gender || !photo)
        return next(new ErrorHandler("Please Enter All Fields", 400));
    user = await User.create({ name, email, dob: new Date(dob), _id, gender, photo });
    return res.status(201).json({
        success: true,
        message: `Welcome, ${user.name}`
    });
    // }
    // catch(error){
    //     return next(error);
    // }
});
export const getAllUsers = TryCatch(async (req, res, next) => {
    const users = await User.find({});
    return res.status(200).json({
        success: true,
        users,
    });
});
export const getUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user)
        return next(new ErrorHandler("Invalid ID", 400));
    return res.status(200).json({
        success: true,
        user,
    });
});
export const deleteUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user)
        return next(new ErrorHandler("Invalid ID", 400));
    await user.deleteOne();
    return res.status(200).json({
        success: true,
        message: "User Deleted Successfully!"
    });
});
