// import Sidebar from "@/components/Sidebar";

import AdminHeader from "../components/AdminHeader";
import Sidebar from "../components/AdminSidebar";


export default function Layout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar remains fixed on the left */}
      <div className=" h-screen sticky top-0 flex">
        <Sidebar />
        
      </div>

      {/* Main content scrolls independently */}
      <main className="flex-1  pb-3 bg-gray-100 overflow-y-auto h-screen">
      <AdminHeader/>
        {children}
      </main>
    </div>
  );
}
