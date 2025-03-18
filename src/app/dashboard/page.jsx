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
        <section className="bg-gradient-to-r from-purple-500 to-indigo-500 shadow-xl rounded-lg p-8 text-white">
          <h2 className="text-3xl font-semibold mb-6 text-center">
            Available Books
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {books.length > 0 ? (
              books.map((book) => (
                <div
                  key={book.id}
                  className="bg-white p-6 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {book.title}
                  </h3>
                  <p className="text-gray-700 text-sm">
                    ✍️ Author:{" "}
                    <span className="font-medium">{book.author}</span>
                  </p>
                  <p className="text-gray-700 text-sm">
                    📅 Published:{" "}
                    <span className="font-medium">{book.publication_year}</span>
                  </p>
                </div>
              ))
            ) : (
              <p className="text-lg font-medium text-center">
                No books available
              </p>
            )}
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}
