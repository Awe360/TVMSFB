import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});

	res.cookie("token", token, {
		httpOnly: true,
		sameSite: "None", 
		secure: process.env.NODE_ENV === "production", 
		path: "/", 
	});
	
	return token;
};
