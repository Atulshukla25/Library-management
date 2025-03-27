import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID;
const CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

const DB_CONFIG = {
  host: "localhost",
  user: "root",
  password: "",
  database: "atul_db",
  port: 3307,
};

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    // Redirect to Instagram login
    return NextResponse.redirect(
      `https://api.instagram.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=http://localhost:3000/api/auth/instagram&scope=user_profile,user_media&response_type=code`
    );
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch(
      "https://api.instagram.com/oauth/access_token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: "authorization_code",
          redirect_uri: "http://localhost:3000/api/auth/instagram",
          code,
        }),
      }
    );

    const { access_token, user_id } = await tokenRes.json();
    if (!access_token) throw new Error("Instagram OAuth Failed");

    // Fetch Instagram user data
    const userRes = await fetch(
      `https://graph.instagram.com/${user_id}?fields=id,username,account_type,media_count&access_token=${access_token}`
    );
    const { id, username } = await userRes.json();

    // Instagram does NOT provide email directly, so generate a placeholder
    const email = `${id}@instagram.com`;

    // Connect to MySQL
    const connection = await mysql.createConnection(DB_CONFIG);

    // Check if user exists
    const [existingUser] = await connection.execute(
      "SELECT id FROM students WHERE email = ?",
      [email]
    );

    let userId;
    if (existingUser.length > 0) {
      userId = existingUser[0].id;
    } else {
      // Insert new user
      const [result] = await connection.execute(
        "INSERT INTO students (full_name, email, password, dob, department, gender, profile_picture) VALUES (?, ?, '', '2000-01-01', 'Computer Science', 'Other', ?)",
        [username, email, ""]
      );
      userId = result.insertId;
    }

    connection.end();

    // Generate JWT token
    const token = jwt.sign({ id: userId, email, name: username }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookies and redirect
    const response = NextResponse.redirect("http://localhost:3000/dashboard");

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    response.cookies.set("userId", userId.toString(), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Instagram OAuth error:", error);
    return NextResponse.json({ error: "OAuth login failed" }, { status: 500 });
  }
}
