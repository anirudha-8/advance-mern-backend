import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
	let token;

	// Extract token from Authorization header "Bearer <token>"
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer ")
	) {
		token = req.headers.authorization.split(" ")[1];
	}

	// If no token present, stop early
	if (!token) {
		return res.status(401).json({ message: "Not authorized, no token!" });
	}

	try {
		// verify token and attach user to request (exclude password)
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.id).select("-password");

		if (!user) {
			return res
				.status(401)
				.json({ message: "Not authorized, user not found!" });
		}

		req.user = user;
		return next();
	} catch (error) {
		console.error("Auth Middleware Error: ", error);
		return res.status(401).json({ message: "Not authorized, token failed!" });
	}
};
