import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc - register route
router.post("/register", registerUser);

// @desc - login route
router.post("/login", loginUser);

// protected route demonstration
router.get("/me", protect, (req, res) => {
	res.status(200).json({
		message: "Access granted to protected route!",
		user: req.user,
	});
});

export default router;
