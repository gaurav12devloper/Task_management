import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';


// login validation
export const longinValidation = () => {
    return [
       body('email').isEmail()
       .withMessage('Email is Not Valid')
       .trim()
       .escape(),
        body('password').isLength({min: 6})
        .withMessage('Password must be at least 6 characters')
        .trim()  
        .escape(),
    ]
}
 // register validation
export const registerValidation = () => {
    return [
        body('email').isEmail()
        .withMessage('Email is Not Valid')
        .trim()
        .escape(),
        body('password').isLength({min: 6})
        .withMessage('Password must be at least 6 characters')
        .trim()  
        .escape(),
        body('name').isLength({min: 6})
        .withMessage('Name must be at least 6 characters')
        .trim()  
        .escape(),
    ]
}

// task validation
export const taskValidation = () => {
    return [
        body('title').isLength({min: 6})
        .optional()
        .withMessage('Title must be at least 6 characters')
        .trim()  
        .escape(),
        body('description').isLength({min: 10})
        .withMessage('Description must be at least 10 characters')
        .trim()  
        .escape(),
    ]
}

// update task validation
export const updateTaskValidation = () => {
    return [
        body('title').isLength({min: 6})
        .withMessage('Title must be at least 6 characters')
        .trim()  
        .escape(),
        body('description').isLength({min: 10})
        .optional()
        .withMessage('Description must be at least 10 characters')
        .trim()  
        .escape(),

    ]
}

// validation middleware
export const validation = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: "The given data was invalid",
        errors: errors.array(),
      });
    }
    next();
  };