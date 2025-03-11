"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Upload, Settings, User, LogOut, Router } from "lucide-react";
import { BsDisplay } from "react-icons/bs";
import { MdAdminPanelSettings, MdSchedule, MdSmartDisplay } from "react-icons/md";
import { LuSquareChevronLeft } from "react-icons/lu";
import { useAuthStore } from "../store/authStore";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import axios from "axios";
// import { purgeStoredState } from 'redux-persist';

const menuItems = [
  { title: "Home", url: "/admin/home", icon: Home },
  { title: "Registered TVs", url: "/admin/fetchAllTV", icon: BsDisplay },
  { title: "Upload Media", url: "/admin/uploadMedia", icon: Upload },
  {title:"Recent Uploads",url:"/admin/recentUpload",icon:LuSquareChevronLeft},
  { title: "Schedule", url: "/admin/schedule", icon: MdSchedule },
  { title: "Manage TVs", url: "/admin/manageTV", icon: MdSmartDisplay },
  { title: "Manage Admin", url: "/admin/manageAdmin", icon: MdAdminPanelSettings },
  { title: "Profile", url: "/admin/profile", icon: User },
];

const Sidebar = () => {
  // const { logout, isLoading, error,isAuthenticated } = useAuthStore();
  const router=useRouter();
  const pathname = usePathname();
  const dispatch=useDispatch();
  console.log(pathname);
const handleLogOut=async() => {
  try {
    
  localStorage.removeItem("user");
  // // Clear persisted Redux state
  // await purgeStoredState(persistConfig);
  const response=await axios.post('https://tvmstd.onrender.com/api/admin/logout');
  dispatch(logout());
  router.push('/auth/login')
  } catch (error) {
    console.log(error?.response?.message)
  }
  
 
}

  return (
    <div className="h-screen w-52 sm:w-64 bg-blue-900 text-white p-5 flex flex-col">
      <h1 className="text-xl font-bold mb-6 text-center">Dashboard</h1>

      <nav className="flex-1 space-y-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname.includes(item.url) || (pathname ==='/admin' && item.title==='Home');
          return (
            <Link key={index} href={item.url}>
              <div
                className={`flex items-center gap-3 px-3 py-1 sm:py-3 rounded-lg cursor-pointer transition ${
                  isActive ? "bg-blue-600" : "hover:bg-blue-700"
                }`}
              >
                <Icon size={30} />
                <span className="text-xl">{item.title}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto" onClick={handleLogOut}>
        <button>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition hover:bg-red-600">
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
