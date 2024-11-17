import { Request, Response, NextFunction } from "express";
import { ErrorType } from "../enums/const.js";

const notFound = (req: Request, res: Response, next: NextFunction): void => {
    const error = new Error(`Not found - ${req.originalUrl}`);
    res.status(404);
    return next(error);
}

const errorHandler = (err: any, req: Request, res: any, next: NextFunction) => {
    // set status code to 500 by default if it's not already set
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // check if it's a MongoDB 'ObjectId' error and set custom message and status
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = ErrorType.RESOURCE_NOT_FOUND;
    }

    // response with the appropriate status and message
    return res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
}

export {
    notFound,
    errorHandler
}
