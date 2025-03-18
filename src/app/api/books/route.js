import { connectDB } from '@/lib/db';

export async function GET() {
  try {
    const db = await connectDB();
    const [books] = await db.execute("SELECT * FROM books");
    db.end();

    return Response.json(books);
  } catch (error) {
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}
