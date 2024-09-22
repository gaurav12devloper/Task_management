import { Request, Response, NextFunction } from 'express'
type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

function asyncHandler(fn: AsyncHandler) {
    return function(req: Request, res: Response, next: NextFunction) {
        Promise.resolve(fn(req, res, next)).catch(next);  // catch any error and pass it to the next middleware
    };
}

export default asyncHandler;