import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
    // const token = req.cookies.get("token")?.value;
    // console.log("token",token)
    // const navigatingRoute = req.nextUrl.pathname;

    // console.log("Protected route:", navigatingRoute);

    // if (token) {
    //     try {
    //         const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    //         const decoded = await jwtVerify(token, secret);
            

    //         // If logged-in user tries to access "/auth/login", redirect to admin dashboard
    //         if (decoded && navigatingRoute.startsWith("/auth")) {
    //             console.log("awoke1")
    //             return NextResponse.redirect(new URL("/admin/home", req.url));
    //         }
    //     } catch (error) {
    //         console.log("Error verifying token:", error);
    //         console.log("awoke2")
    //         return NextResponse.redirect(new URL("/auth/login", req.url));
    //     }
    // } else {
    //     // Allow unauthenticated access to "/auth/login"
    //     if (navigatingRoute.startsWith("/auth")) {
    //         console.log("awoke3")
    //         return NextResponse.next();
    //     }

    //     console.log("No token found, redirecting...");

    //     console.log("awoke4")
    //     return NextResponse.redirect(new URL("/auth/login", req.url));
    // }
    // console.log("awoke5")
    // return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/profile/:path*","/auth/:path*"]
};
