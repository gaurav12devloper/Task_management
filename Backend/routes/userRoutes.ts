import express from 'express';
import { registerUser, authUser, logout } from '../controllers/userController';
import { validation,longinValidation, registerValidation} from '../validation';
const router = express.Router();

router.route('/register').post(registerValidation(),validation,registerUser);
router.route('/login').post(longinValidation(),validation,authUser);
router.route('/logout').post(logout);

export default router;
