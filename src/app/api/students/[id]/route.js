import { connectDB } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const db = await connectDB();
    const [student] = await db.execute('SELECT * FROM students WHERE id = ?', [params.id]);
    db.end();

    if (student.length === 0) {
      return Response.json({ error: 'Student not found' }, { status: 404 });
    }

    return Response.json(student[0]);
  } catch (error) {
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}
