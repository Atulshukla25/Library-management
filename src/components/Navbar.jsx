"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar({ user }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    router.push("/login");
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
            />
            <span>{user.full_name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
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
