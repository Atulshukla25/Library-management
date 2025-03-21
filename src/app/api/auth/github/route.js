import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
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
    return NextResponse.redirect(
      `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user:email`
    );
  }

  try {
    const tokenRes = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code,
        }),
      }
    );

    const { access_token } = await tokenRes.json();
    if (!access_token) throw new Error("GitHub OAuth Failed");

    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const userData = await userRes.json();

    let email = userData.email;
    if (!email) {
      const emailRes = await fetch("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const emails = await emailRes.json();
      email = emails.find((e) => e.primary)?.email || null;
    }

    if (!email) throw new Error("Email not found");

    const { id, login, avatar_url } = userData;

    const connection = await mysql.createConnection(DB_CONFIG);

    const [existingUser] = await connection.execute(
      "SELECT id, full_name, email, profile_picture FROM students WHERE email = ?",
      [email]
    );

    let userId;
    if (existingUser.length > 0) {
      userId = existingUser[0].id;
    } else {
      const [result] = await connection.execute(
        "INSERT INTO students (full_name, email, password, dob, department, gender, profile_picture) VALUES (?, ?, '', '2000-01-01', 'Computer Science', 'Male', ?)",
        [login, email, avatar_url]
      );
      userId = result.insertId;
    }

    connection.end();

    const token = jwt.sign(
      { id: userId, email, name: login, picture: avatar_url },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.redirect("http://localhost:3000/dashboard");

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    response.cookies.set("userId", userId.toString(), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    return NextResponse.json({ error: "OAuth login failed" }, { status: 500 });
  }
}
