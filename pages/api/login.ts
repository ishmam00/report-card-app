import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

// Path to the users.json file
const usersFilePath = path.resolve(process.cwd(), 'users.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Read users data from the users.json file
    const usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

    // Find user by email and password
    const user = usersData.find((user: any) => user.email === email && user.password === password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Set user session or token (you'd likely use something like JWT for authentication)
    // For simplicity, let's just return the user's role in the response
    res.status(200).json({ role: user.role });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
