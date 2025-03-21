"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaFacebook, FaGithub, FaGoogle } from "react-icons/fa";
import Cookies from "js-cookie";
import axios from "axios";
import useAuthStore from "@/store";

const loginSchema = z.object({
  email: z.string().email("Email field is required"),
  password: z.string().min(6, "Password field is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const { loginWithCredential, handleOAuth } = useAuthStore();

  const [serverError, setServerError] = useState("");

  const onSubmit = (data) => {
    loginWithCredential(data, router);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-2xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-black">Login</h2>

        {serverError && (
          <p className="text-red-600 text-center font-medium">{serverError}</p>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 text-gray-600"
        >
          <div>
            <label className="block text-sm font-medium text-black">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="w-full mt-1 p-3 border border-black rounded-lg focus:ring focus:ring-black focus:outline-none bg-white placeholder-gray-600"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-black">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className="w-full mt-1 p-3 border border-black rounded-lg focus:ring focus:ring-black focus:outline-none bg-white placeholder-gray-600"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring focus:ring-blue-400 transition duration-300"
          >
            LOGIN
          </button>
        </form>
        <p className="mt-4 text-center text-md text-black">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-black font-medium hover:underline"
          >
            Create now
          </Link>
        </p>
        <div className="flex justify-center items-center">
          <hr className="w-[50%] h-[1px] bg-[#a5a0a0] border-0" />
          <p className="px-5 text-black font-bold">Or</p>
          <hr className="w-[50%] h-[1px] bg-[#a5a0a0] border-0" />
        </div>
        <button
          className="w-full py-3 flex justify-center items-center gap-x-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 focus:ring focus:ring-yellow-600 transition duration-300"
          onClick={() => {
            handleOAuth("google");
          }}
        >
          <FaGoogle className="text-xl" /> CONTINUE WITH GOOGLE
        </button>
        <button
          className="w-full py-3 flex justify-center items-center gap-x-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-700 focus:ring focus:ring-gray-600 transition duration-300"
          onClick={() => {
            handleOAuth("github");
          }}
        >
          <FaGithub className="text-xl" /> CONTINUE WITH GITHUB
        </button>
        <button
          className="w-full py-3 flex justify-center items-center gap-x-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-800 focus:ring focus:ring-blue-400 transition duration-300"
          onClick={() => {
            handleOAuth("facebook");
          }}
        >
          <FaFacebook className="text-xl" /> CONTINUE WITH FACEBOOK
        </button>
      </div>
    </div>
  );
}
