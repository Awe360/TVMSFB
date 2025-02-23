import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});

	res.cookie("token", token, {
		httpOnly: true,
		sameSite: "None", 
		secure: true, 
		path: "/", 
	});
	
	return token;
};
