import jwt from 'jsonwebtoken';
import { Response } from 'express';

const generateToken = (res: Response, userId: any):void => {
    // Ensure the secret key is defined
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
        throw new Error('JWT_SECRET is not defined');
    }

    // Generate the JWT token
    const token = jwt.sign({userId}, secretKey, {
        expiresIn: '30d',
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'Production', // Secure cookies in production
        sameSite: 'strict', 
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 Days
    });
};
export default generateToken;
