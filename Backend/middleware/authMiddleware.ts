import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import userModel, { IUser } from '../models/userModel';
import asyncHandler from './asyncHandler';

interface DecodedToken {
    userId: string;
}
interface CustomRequest extends Request {
    user?: IUser | null;
}
const protect = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    let token;
    if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    //console.log(token);
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
        req.user = await userModel.findById(decoded.userId).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "Not authorized, user not found" });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
});
export default protect;