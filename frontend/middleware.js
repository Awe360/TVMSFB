import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
    const token = req.cookies.get("token")?.value;
    const navigatingRoute = req.nextUrl.pathname;

    console.log("Protected route:", navigatingRoute);

    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            const decoded = await jwtVerify(token, secret);
            

            // If logged-in user tries to access "/auth/login", redirect to admin dashboard
            if (decoded && navigatingRoute.startsWith("/auth")) {
                return NextResponse.redirect(new URL("/admin/home", req.url));
            }
        } catch (error) {
            console.log("Error verifying token:", error);
            return NextResponse.redirect(new URL("/auth/login", req.url));
        }
    } else {
        // Allow unauthenticated access to "/auth/login"
        if (navigatingRoute.startsWith("/auth")) {
            return NextResponse.next();
        }

        console.log("No token found, redirecting...");
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/profile/:path*","/auth/:path*"]
};
