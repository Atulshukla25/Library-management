"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Navbar({ user }) {
  const router = useRouter();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        Cookies.remove("token");
        Cookies.remove("userId"); 
        router.push("/login");
      } else {
        console.error("Logout failed:", await res.json());
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        Student Portal
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link href="/books" className="hover:underline">
          Books
        </Link>
        {user ? (
          <div className="flex items-center gap-2">
            <img
              src={user.profile_picture}
              alt="Profile"
              className="w-10 h-10 rounded-full border"
              onClick={togglePopup}
            />
            {isPopupOpen && (
              <div className="absolute top-18 right-0 bg-white text-black p-4 shadow-lg rounded-md w-64 z-10">
                <h3 className="text-lg font-semibold">User Profile</h3>
                <p className="mt-2">
                  <strong>Name:</strong> {user.full_name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Department:</strong> {user.department}
                </p>
                <p>
                  <strong>Gender:</strong> {user.gender}
                </p>
                <button
                  onClick={handleLogout}
                  className="mt-4 w-full bg-red-500 text-white px-3 py-1 rounded"
                >
                  Logout
                </button>
                <button
                  onClick={togglePopup}
                  className="mt-4 w-full bg-green-600 text-white px-3 py-1 rounded"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/login" className="hover:underline">
              Login
            </Link>
            <Link href="/signup" className="hover:underline">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
