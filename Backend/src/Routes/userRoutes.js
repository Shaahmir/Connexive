import { Router } from "express";
import { userRegister, userLogin, getHistory, setHistory } from '../Controllers/userControllers.js';

const router = Router();

router.route('/register').post(userRegister);
router.route('/login').post(userLogin);
router.route('/getHistory').get(getHistory);
router.route('/setHistory').post(setHistory);

export default router;