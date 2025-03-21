"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Cookies from "js-cookie";
import axios from "axios";
import useAuthStore from "@/store";

export default function Dashboard() {
  const router = useRouter();
  const { user, fetchStudents } = useAuthStore();

  useEffect(() => {
    const userId = Cookies.get("userId");
    fetchStudents(userId);
  }, [router]);

  return (
    <div>
      <Navbar user={user} />
      <div className="container mx-auto mt-8 px-6">
        <h1 className="text-4xl font-extrabold text-white mb-6 text-center">
          📚 Welcome to Dashboard {user?.id}
        </h1>
        <h1 className="text-2xl font-extrabold text-white mb-6 text-center">
          {user?.full_name}
        </h1>
      </div>
    </div>
  );
}
