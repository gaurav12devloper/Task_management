import {Request, Response} from "express";
import asyncHandler from "../middleware/asyncHandler";
import userModel from "../models/userModel";
import generateToken from "../utils/generateToken";

// @desc    Register a new user
// @route   POST /api/users/Register
// @access  Public

const registerUser = asyncHandler(async(req: Request, res: Response)=>{
    const {name, email, password} = req.body;
    const userExists = await userModel.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error("User already exists");
    }
    const user = await userModel.create({
        name,
        email,
        password
    });
    if(user){
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    }
    else{
        res.status(400);
        throw new Error("Invalid user data");
    }
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public

const authUser = asyncHandler(async(req:Request,res:Response)=>{
    const { email, password } = req.body;
    const user= await userModel.findOne({email});
    if(user && (await user.matchPassword(password))){
        generateToken(res, user._id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    }
    else{
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

// @desc    logout
// @route   GET /api/users/logout
// @access  Public
const logout = asyncHandler(async(req:Request,res:Response)=>{
    res.cookie('jwt', '',{
        httpOnly: true,
        expires : new Date(0)
    });
    res.status(200).json({success:true, message: 'Logged out successfully'});
});

export {registerUser, authUser, logout};