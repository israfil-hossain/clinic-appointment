// components/Navbar.js
"use client";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/store";
import Cookies from "js-cookie";

export default function Navbar() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const { clearUser } = useUserStore();

  const handleLogout = async () => {
    const res = await axios.get("/api/logout");
    Cookies.remove("token");
    clearUser();
    toast.success(res.data.message);
    router.push("/");
  };

  return (
    <nav className="bg-white p-4 w-full">
      <div className="container mx-auto w-full max-w-7xl flex justify-between items-center">
        {/* Logo */}
        <div className="flex space-x-5 justify-center items-center ">
          <Link href="/" className=" text-lg font-bold">
            <Image
              src="/mos2.jpg"
              width={100}
              height={50}
              alt="logo"
              className="w-16 h-8 rounded-sm"
            />
          </Link>
          {user && (
            <Link href="/dashboard" className=" hover:text-blue-400">
              Dashboard
            </Link>
          )}

          {/* <Link href="/users" className=" hover:text-blue-400">
            Users
          </Link> */}
          <Link href="/doctors" className=" hover:text-blue-400">
            Doctors
          </Link>
        </div>
        <div className="flex space-x-3">
          {user ? (
            <>
              <div className="flex-col lg:flex hidden mr-5">
                <p className="text-[16px] font-bold ">{user?.username}</p>
                <p className="text-[12px] font-normal text-blue-600">
                  {user?.role}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="text-white hover:text-blue-200 bg-red-500 hover:bg-red-400 px-6 py-1 rounded-full h-8 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push("/")}
              className="text-white hover:text-blue-200 bg-blue-500 hover:bg-blue-400 px-6 py-1 rounded-full h-8 text-sm"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
