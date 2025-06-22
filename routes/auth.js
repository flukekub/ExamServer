
import express from "express";
import { register, login, logout } from "../controllers/auth.js";

const router = express.Router();
import { protect } from "../middleware/auth.js";


router.post('/register', register);

router.post('/login', login);

router.get('/logout', protect, logout);



export default router;