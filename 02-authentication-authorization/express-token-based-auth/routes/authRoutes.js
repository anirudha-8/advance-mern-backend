import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

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

// admin-only route
router.get("/admin", protect, authorize("admin"), (req, res) => {
	res.status(200).json({
		message: `Welcome Admin, ${req.user.name}`,
	});
});

export default router;
