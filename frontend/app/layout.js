import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProvider from "./components/ClientProvider";
import { ToastContainer } from "react-toastify";
import NextTopLoader from 'nextjs-toploader';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TV Management System",
  description: "It is a software for managing media to be displayed on TV",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientProvider>
        <ToastContainer position="top-right" theme="dark" autoClose={3000} />
          {children}
          <NextTopLoader color="white" height={5}/>
        </ClientProvider>
      </body>
    </html>
  );
}
