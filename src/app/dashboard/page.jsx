"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Cookies from "js-cookie";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const userId = Cookies.get("userId");

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
    <div>
      <Navbar user={user} />
      <div className="container mx-auto mt-8 px-6">
        <h1 className="text-4xl font-extrabold text-white mb-6 text-center">
          📚 Welcome to Dashboard
        </h1>
        <h1 className="text-2xl font-extrabold text-white mb-6 text-center">
          {user?.full_name}
        </h1>
      </div>
    </div>
  );
}
