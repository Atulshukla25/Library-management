"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import flatpickr from "flatpickr";
import "flatpickr/dist/themes/light.css";
import { FaFacebook } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { signupSchema } from "@/schema/validation";

export default function Signup() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ resolver: zodResolver(signupSchema) });

  const [serverError, setServerError] = useState("");
  const handleGoogle = async () => {
    try {
      window.location.href = "/api/auth/google";
    } catch (error) {
      console.error("Google login failed", error);
    }
  };
  const handleGithub = async () => {
    try {
      window.location.href = "http://localhost:3000/api/auth/github";
    } catch (error) {
      console.error("GitHub login failed", error);
    }
  };

  const handleFacebook = async () => {
    try {
      window.location.href = "http://localhost:3000/api/auth/facebook";
    } catch (error) {
      console.error("GitHub login failed", error);
    }
  };

  useEffect(() => {
    flatpickr("#dob", {
      dateFormat: "Y-m-d",
      maxDate: "today",
      onChange: function (selectedDates, dateStr, instance) {
        setValue("dob", dateStr, { shouldValidate: true });
      },
    });
  }, [setValue]);

  const [departments, setDepartments] = useState([]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("full_name", data.full_name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("dob", data.dob);
    formData.append("department", data.department);
    formData.append("gender", data.gender);
    formData.append("profile_picture", data.profile_picture[0]);

    try {
      await axios.post("/api/auth/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      router.push("/dashboard");
      alert("Signup successful! Redirecting...");
    } catch (error) {
      setServerError("Failed to sign up. Please try again.");
    }
  };

  const fetchDepartment = async () => {
    const fetchData = await axios.get("/api/departments");
    setDepartments(fetchData.data);
    console.log(fetchData.data);
  };

  useEffect(() => {
    fetchDepartment();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-white">
      <div className="w-full mt-12 mb-12 max-w-2xl p-8 space-y-6 bg-white shadow-lg rounded-2xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-black mb-4">
          Create an account
        </h2>

        {serverError && (
          <p className="text-red-600 text-center font-medium mb-4">
            {serverError}
          </p>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 text-gray-800"
        >
          <div className="grid grid-cols-2 gap-6">
            {[
              {
                label: "Full Name",
                type: "text",
                name: "full_name",
                placeholder: "Enter your name",
              },
              {
                label: "Email",
                type: "email",
                name: "email",
                placeholder: "Enter your email",
              },
              {
                label: "Password",
                type: "password",
                name: "password",
                placeholder: "Create your password",
              },
              {
                label: "Date of Birth",
                type: "date",
                name: "dob",
                placeholder: "Select your date of birth",
              },
            ].map(({ label, type, name, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-black">
                  {label}
                </label>
                <input
                  type={type}
                  id={name === "dob" ? "dob" : undefined}
                  {...register(name)}
                  placeholder={placeholder}
                  className="w-full mt-1 p-1 px-4 py-2 border border-black rounded-lg focus:ring focus:ring-red-400 focus:outline-none bg-white"
                />
                {errors[name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[name]?.message}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black">
                Department
              </label>
              <select
                {...register("department")}
                className="w-full mt-1 px-4 py-2 p-1 border border-black rounded-lg focus:ring focus:ring-red-400 focus:outline-none bg-white"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.department}>
                    {dept.department}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.department.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black">
                Gender
              </label>
              <div className="flex space-x-4 mt-3">
                {["Male", "Female", "Other"].map((value) => (
                  <label
                    key={value}
                    className="flex items-center space-x-2 text-gray-800"
                  >
                    <input
                      type="radio"
                      value={value}
                      {...register("gender")}
                      className="w-4 h-4 text-black focus:ring focus:ring-blue-900"
                    />
                    <span>{value}</span>
                  </label>
                ))}
              </div>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black">
              Profile Picture
            </label>
            <input
              type="file"
              {...register("profile_picture")}
              className="w-full mt-1 p-1 border px-4 py-2 border-black rounded-lg focus:ring focus:ring-red-400 focus:outline-none bg-white"
            />
            {errors.profile_picture && (
              <p className="text-red-500 text-sm mt-1">
                {errors.profile_picture.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:ring focus:ring-red-400 transition duration-300"
          >
            SIGNUP
          </button>
        </form>

        <div className="flex justify-center items-center">
          <hr className="w-[40%] h-[1px] bg-[#a5a0a0] border-0" />
          <p className="px-5 text-black font-bold">Or</p>
          <hr className="w-[40%] h-[1px] bg-[#a5a0a0] border-0" />
        </div>

        <button
          className="w-full py-3 flex justify-center items-center gap-x-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 focus:ring focus:ring-yellow-600 transition duration-300"
          onClick={handleGoogle}
        >
          <FaGoogle className="text-xl" /> SIGNUP WITH GOOGLE
        </button>
        <button
          className="w-full py-3 flex justify-center items-center gap-x-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 focus:ring focus:ring-gray-600 transition duration-300"
          onClick={handleGithub}
        >
          <FaGithub className="text-xl" /> SIGNUP WITH GITHUB
        </button>
        <button
          className="w-full py-3 flex justify-center items-center gap-x-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring focus:ring-blue-400 transition duration-300"
          onClick={handleFacebook}
        >
          <FaFacebook className="text-xl" /> <p>SIGNUP WITH FACEBOOK</p>
        </button>

        <p className="mt-4 text-center text-sm text-black">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-black font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
