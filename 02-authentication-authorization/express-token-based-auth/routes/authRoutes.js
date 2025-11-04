import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";

const router = express.Router();

// @desc - register route
router.post("/register", registerUser);

// @desc - login route
router.post("/logic", loginUser);

export default router;
