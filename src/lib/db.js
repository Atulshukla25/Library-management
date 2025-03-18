import mysql from "mysql2/promise";

export async function connectDB() {
  return await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "atul_db",
    port: 3307,
  });
}
