import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

// Path to the users.json file
const usersFilePath = path.resolve(process.cwd(), 'public', 'data', 'users.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, contactNumber, department, role, fatherName, email, password } = req.body;

    // Read existing users' data from the JSON file
    let usersData = [];
    try {
      const data = fs.readFileSync(usersFilePath, 'utf-8');
      usersData = JSON.parse(data);
    } catch (error) {
      console.error('Error reading users file:', error);
    }

    // Check if the email is already registered
    const existingUser = usersData.find((user: any) => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Create a new user object
    const newUser = {
      id: usersData.length + 1,
      name,
      contactNumber,
      department,
      role,
      fatherName,
      email,
      password,
    };

    // Add the new user to the array
    usersData.push(newUser);

    // Write the updated array back to the JSON file
    try {
      fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2));
    } catch (error) {
      console.error('Error writing users file:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(201).json({ message: 'User registered successfully' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
