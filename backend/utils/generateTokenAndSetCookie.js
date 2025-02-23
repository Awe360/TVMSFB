import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});

	res.cookie("token", token, {
		httpOnly:true,
		sameSite: "strict", 
		secure: true,
		expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
		path: "/", 
	});


	
	
	return token;
};
