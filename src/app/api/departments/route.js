import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    const db = await connectDB();
    const [departments] = await db.execute("SELECT * FROM department_table");
    db.end();

    return Response.json(departments);
  } catch (error) {
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}
