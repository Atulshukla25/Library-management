"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import flatpickr from "flatpickr";
import "flatpickr/dist/themes/light.css";
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const signupSchema = z.object({
  full_name: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Email address is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
  dob: z.string().min(8, "Date of birth is required"),
  department: z.enum(
    ["Computer Science", "Electronics", "Mechanical", "Civil", "Mathematics"],
    { message: "Please select a department" }
  ),
  gender: z.enum(["Male", "Female", "Other"], {
    message: "Please select a gender",
  }),
  profile_picture: z
    .any()
    .refine((files) => files.length > 0, "Profile picture is required")
    .refine(
      (files) => ALLOWED_FILE_TYPES.includes(files[0]?.type),
      "Only JPG, JPEG, and PNG files are allowed"
    )
    .refine(
      (files) => files[0]?.size <= MAX_FILE_SIZE,
      "File must be under 2MB"
    ),
});

function handleGoogle() {
  alert("You clicked Signup with google");
}
function handleGithub() {
  alert("You clicked Signup with github");
}

export default function Signup() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ resolver: zodResolver(signupSchema) });

  const [serverError, setServerError] = useState("");

  useEffect(() => {
    flatpickr("#dob", {
      dateFormat: "Y-m-d",
      maxDate: "today",
      onChange: function (selectedDates, dateStr, instance) {
        setValue("dob", dateStr);
      },
    });
  }, [setValue]);

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-white">
      <div className="w-full mt-12 mb-12 max-w-2xl p-8 space-y-6 bg-white shadow-lg rounded-2xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-black mb-4">
          Sign Up
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
              { label: "Date of Birth", type: "date", name: "dob" },
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
                {[
                  "Computer Science",
                  "Electronics",
                  "Mechanical",
                  "Civil",
                  "Mathematics",
                ].map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
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
            Sign Up
          </button>
        </form>

        <p className="flex justify-center text-black text-mg font-bold">Or</p>
        <button
          className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring focus:ring-blue-400 transition duration-300"
          onClick={handleGoogle}
        >
          Signup with Google
        </button>
        <button
          className="w-full py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 focus:ring focus:ring-gray-600 transition duration-300"
          onClick={handleGithub}
        >
          Signup with GitHub
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
