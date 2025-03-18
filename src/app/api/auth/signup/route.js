import { connectDB } from "@/lib/db";
import bcrypt from "bcrypt";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData(); 

    const full_name = formData.get("full_name");
    const email = formData.get("email");
    const password = formData.get("password");
    const dob = formData.get("dob");
    const department = formData.get("department");
    const gender = formData.get("gender");
    const profile_picture = formData.get("profile_picture");

    let filePath = "";
    if (profile_picture) {
      const bytes = await profile_picture.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), "public/uploads");
      const fileName = `${Date.now()}-${profile_picture.name}`;
      filePath = `/uploads/${fileName}`;

      await writeFile(path.join(uploadDir, fileName), buffer);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const db = await connectDB();
    const [result] = await db.execute(
      "INSERT INTO students (full_name, email, password, dob, department, gender, profile_picture) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [full_name, email, hashedPassword, dob, department, gender, filePath]
    );
    db.end();

    return Response.json({ message: "User registered successfully", id: result.insertId });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}
