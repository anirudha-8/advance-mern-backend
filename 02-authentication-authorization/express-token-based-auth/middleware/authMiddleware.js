import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
	let token;

	// check if token exists in Authorization header
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			// extract token
			token = req.headers.authorization.split(" ")[1];

			// verify token
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			// find user (excluding password)
			req.user = await User.findById(decoded.id).select("-password");

			next();
		} catch (error) {
			console.error("Auth Middleware Error: ", error);
			res.status(401).json({ message: "Not authorized, token failed!" });
		}
	}

	if (!token) {
		res.status(401).json({ message: "Not authorized, no token!" });
	}
};
