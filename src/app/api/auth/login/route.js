import { connectDB } from '@/lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    const db = await connectDB();
    const [users] = await db.execute('SELECT * FROM students WHERE email = ?', [email]);
    db.end();

    if (users.length === 0) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, 'your_secret_key', { expiresIn: '1h' });

    return Response.json({ message: 'Login successful', token, userId: user.id });
  } catch (error) {
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}
