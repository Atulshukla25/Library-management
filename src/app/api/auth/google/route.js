import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import { serialize } from "cookie";

dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/api/auth/google";
const JWT_SECRET = process.env.JWT_SECRET;

const DB_CONFIG = {
  host: "localhost",
  user: "root",
  password: "",
  database: "atul_db",
  port: 3307,
};

const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    const authUrl = client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["openid", "email", "profile"],
    });

    return NextResponse.redirect(authUrl);
  }

  try {

    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

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
        [name, email, picture]
      );

      userId = result.insertId;
    }

    connection.end();

    const token = jwt.sign(
      {
        id: userId,
        email,
        name,
        picture,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.redirect("http://localhost:3000/dashboard");

    response.headers.append(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      })
    );

    response.headers.append(
      "Set-Cookie",
      serialize("userId", userId.toString(), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      })
    );

    return response;
  } catch (error) {
    console.error("Google OAuth error:", error);
    return NextResponse.json({ error: "OAuth login failed" }, { status: 500 });
  }
}
