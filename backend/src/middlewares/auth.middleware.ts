import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/user.model.js';
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import { ErrorType } from '../enums/const.js';

// protect middleware to check for valid token
const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies.jwt; // .. get the token from the cookies

    if (!token) {
        res.status(403);
        throw new Error(ErrorType.UNAUTHORIZED_ACTION);
    }

    try {
        // verify the token using JWT_SECRET_KEY
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;

        if (typeof decoded === 'object' && decoded._id) {
            // find the user associated with the decoded token
            const user = await User.findById(decoded._id).select('-password'); // .. excluding the password
            (req as any).user = user;
            return next();
        } else {
            throw new Error(ErrorType.VERIFICATION_CODE_NOT_FOUND);
        }
    } catch (error) {
        res.status(403); // in case of an error, deny access
        throw new Error(ErrorType.UNAUTHORIZED_ACTION);
    }
});

export { protect };
