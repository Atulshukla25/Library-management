import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

export const signupSchema = z.object({
  full_name: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Please enter your email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
  dob: z.string().min(8, "Please select your date of birth"),
  department: z.enum(
    ["Computer Science", "Electronics", "Mechanical", "Civil", "Mathematics"],
    { message: "Please select a department" }
  ),
  gender: z.enum(["Male", "Female", "Other"], {
    message: "Please select a gender",
  }),
  profile_picture: z
    .any()
    .refine((files) => files.length > 0, "Please upload your profile picture")
    .refine(
      (files) => ALLOWED_FILE_TYPES.includes(files[0]?.type),
      "Only JPG, JPEG, and PNG files are allowed"
    )
    .refine(
      (files) => files[0]?.size <= MAX_FILE_SIZE,
      "File must be under 2MB"
    ),
});
