import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please, enter your name!"],
		},
		email: {
			type: String,
			required: [true, "Please, enter your email!"],
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: [true, "Please, enter your password!"],
			minlength: 6,
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
	},
	{
		timestamps: true,
	}
);

// encrypt password before saving
userSchema.pre("save", async (next) => {
	if (!this.isModified("password")) return next();

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

const User = mongoose.model("User", userSchema);

export default User;
