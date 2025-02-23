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
  httpOnly: true,  // Prevent JavaScript access
  secure: true,    // Must be true for HTTPS (Vercel & Render are HTTPS)
  sameSite: "None", // Required for cross-origin requests
  path: "/",
  maxAge: 24 * 60 * 60 * 1000,  // 1-day expiration
});

	
	
	return token;
};
