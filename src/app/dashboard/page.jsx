"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute.js";
import Navbar from "@/components/Navbar";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      router.push("/login");
      return;
    }

    fetch(`/api/students/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Error fetching user:", err));

    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Error fetching books:", err));
  }, [router]);

  return (
    <ProtectedRoute>
      <Navbar user={user} />
      <div className="container mx-auto mt-8 px-6">
        <h1 className="text-4xl font-extrabold text-white mb-6 text-center">
          📚 Welcome to Dashboard
        </h1>
        <h1 className="text-2xl font-extrabold text-white mb-6 text-center">
          {user?.full_name}
        </h1>
       
      </div>
    </ProtectedRoute>
  );
}
