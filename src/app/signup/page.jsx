"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import flatpickr from "flatpickr";
import "flatpickr/dist/themes/light.css";
import { FaFacebook, FaGithub, FaGoogle } from "react-icons/fa";
import { signupSchema } from "@/schema/validation";
import useAuthStore from "@/store";

export default function Signup() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ resolver: zodResolver(signupSchema) });
  const { departments, fetchDepartments, handleOAuth, signupWithCredential } =
    useAuthStore();

  const [serverError, setServerError] = useState("");

  useEffect(() => {
    flatpickr("#dob", {
      dateFormat: "Y-m-d",
      maxDate: "today",
      onChange: (selectedDates, dateStr) => {
        setValue("dob", dateStr, { shouldValidate: true });
      },
    });
  }, [setValue]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("full_name", data.full_name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("dob", data.dob);
    formData.append("department", data.department);
    formData.append("gender", data.gender);
    formData.append("profile_picture", data.profile_picture[0]);
    signupWithCredential(formData, router);
  };

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
                // type: "date",
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
                  className="w-full mt-1 p-1 px-4 py-2 border border-black rounded-lg focus:ring focus:ring-black focus:outline-none bg-white"
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
                className="w-full mt-1 px-4 py-2 p-1 border border-black rounded-lg focus:ring focus:ring-black focus:outline-none bg-white"
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
              className="w-full mt-1 p-1 border px-4 py-2 border-black rounded-lg focus:ring focus:ring-black focus:outline-none bg-white"
            />
            {errors.profile_picture && (
              <p className="text-red-500 text-sm mt-1">
                {errors.profile_picture.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring focus:ring-black transition duration-300"
          >
            SIGNUP
          </button>
        </form>

        <p className="mt-4 text-center text-md text-black">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-black font-medium hover:underline"
          >
            Login
          </Link>
        </p>

        <div className="flex justify-center items-center">
          <hr className="w-[50%] h-[1px] bg-[#a5a0a0] border-0" />
          <p className="px-5 text-black font-bold">Or</p>
          <hr className="w-[50%] h-[1px] bg-[#a5a0a0] border-0" />
        </div>

        {[
          {
            provider: "google",
            color: "bg-red-500 hover:bg-red-600",
            icon: <FaGoogle className="text-xl" />,
          },
          {
            provider: "github",
            color: "bg-gray-900 hover:bg-gray-700",
            icon: <FaGithub className="text-xl" />,
          },
          {
            provider: "facebook",
            color: "bg-blue-800 hover:bg-blue-900",
            icon: <FaFacebook className="text-xl" />,
          },
        ].map(({ provider, color, icon }) => (
          <button
            key={provider}
            className={`w-full py-3 flex justify-center items-center gap-x-2 ${color} text-white font-medium rounded-lg focus:ring transition duration-300`}
            onClick={() => handleOAuth(provider)}
          >
            {icon} SIGNUP WITH {provider.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
