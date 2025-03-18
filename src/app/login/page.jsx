"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("email field is required"),
  password: z.string().min(6, "password field is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const [serverError, setServerError] = useState("");

  const onSubmit = async (data) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("userId", result.userId);
        router.push("/dashboard");
      } else {
        setServerError(result.error || "Login failed. Try again.");
      }
    } catch (error) {
      setServerError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-2xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-blue-800">Login</h2>

        {serverError && (
          <p className="text-red-600 text-center font-medium">{serverError}</p>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 text-gray-600"
        >
          <div>
            <label className="block text-sm font-medium text-blue-900">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="w-full mt-1 p-3 border border-blue-300 rounded-lg focus:ring focus:ring-blue-400 focus:outline-none bg-white placeholder-gray-600"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-900">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className="w-full mt-1 p-3 border border-blue-300 rounded-lg focus:ring focus:ring-blue-400 focus:outline-none bg-white placeholder-gray-600"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring focus:ring-blue-400 transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-blue-700">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-800 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
