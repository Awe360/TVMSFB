import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});

	// res.cookie("token", token, {
	// 	httpOnly: true,
	// 	sameSite: "None", 
	// 	secure: true,
	// 	maxAge: 60 * 60 * 24 * 7,
	// 	path: "/", 
	// });
	res.cookie("token", token, {
    httpOnly: true,
    secure: true, // Set to false for localhost (HTTP)
    sameSite: "none", // Allow cross-origin cookies
    maxAge: 60 * 60 * 24 * 7, // 1 week
});
	
	return token;
};
