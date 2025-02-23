"use client";

import { getCookie } from "cookies-next";
import {jwtDecode} from "jwt-decode";

export const getUserIdFromToken = () => {
    const token = getCookie("token");
    console.log("token",token) 
    if (token) {
        
        try {
            const decodedToken = jwtDecode(token); 
            return decodedToken.userId; 
        } catch (error) {
            console.error("Invalid token:", error);
            return null;
        }
    }
    return null;
};