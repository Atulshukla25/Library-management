import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import axios from "axios";

dotenv.config();

const CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
const CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;
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
      `https://www.facebook.com/v18.0/dialog/oauth?client_id=${CLIENT_ID}&redirect_uri=http://localhost:3000/api/auth/facebook&scope=email,public_profile`
    );
  }

  try {
    const tokenRes = await axios.get(
      `https://graph.facebook.com/v18.0/oauth/access_token`,
      {
        params: {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          redirect_uri: "http://localhost:3000/api/auth/facebook",
          code,
        },
      }
    );

    const { access_token } = tokenRes.data;
    if (!access_token) throw new Error("Facebook OAuth Failed");

    const userRes = await axios.get(`https://graph.facebook.com/me`, {
      params: {
        fields: "id,name,email,picture",
        access_token,
      },
    });

    const { id, name, email, picture } = userRes.data;

    const connection = await mysql.createConnection(DB_CONFIG);

    const [existingUser] = await connection.execute(
      "SELECT id FROM students WHERE email = ?",
      [email]
    );

    let userId;
    if (existingUser.length > 0) {
      userId = existingUser[0].id;
    } else {
      const [result] = await connection.execute(
        "INSERT INTO students (full_name, email, password, dob, department, gender, profile_picture) VALUES (?, ?, '', '2000-01-01', 'Computer Science', 'Male', ?)",
        [name, email, picture.data.url]
      );
      userId = result.insertId;
    }

    connection.end();

    const token = jwt.sign(
      { id: userId, email, name, picture: picture.data.url },
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
    console.error("Facebook OAuth error:", error);
    return NextResponse.json({ error: "OAuth login failed" }, { status: 500 });
  }
}
