import User from "../models/User.js";
import jwt from "jsonwebtoken";

// generate JWT token
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "1d", // 1 day expiry
	});
};

/**
 * Register Controller
 * @desc 	Register new user
 * @route 	POST /auth/register
 * @access 	Public
 */
export const registerUser = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		// validate input
		if (!name || !email || !password) {
			return res.status(400).json({ message: "All fields are required!" });
		}

		// check if user is already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists!" });
		}

		// create new user
		const newUser = await User.create({ name, email, password });

		// send success response
		res.status(201).json({
			_id: newUser._id,
			name: newUser.name,
			email: newUser.email,
			role: newUser.role,
			token: generateToken(newUser._id),
		});
	} catch (error) {
		console.error("Error in registration of user: ", error);
		res.status(500).json({ message: "Internal Server Error!" });
	}
};

/**
 * Login Controller
 * @desc 	login user
 * @route 	POST /auth/register
 * @access 	Public
 */

export const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		// validate input
		if (!email || !password) {
			return res
				.status(400)
				.json({ message: "Email and password are required!" });
		}

		// check if user exists and get password field
		const user = await User.findOne({ email }).select("+password");
		if (!user) {
			return res.status(401).json({ message: "Invalid credentials!" });
		}

		// check password matched or not (use instance method)
		const isPasswordMatch = await user.matchPassword(password);
		if (!isPasswordMatch) {
			return res.status(401).json({ message: "Invalid credentials!" });
		}

		// send success response with JWT
		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			token: generateToken(user._id),
		});
	} catch (error) {
		console.error("Error in login of user: ", error);
		res.status(500).json({ message: "Internal Server Error!" });
	}
};
