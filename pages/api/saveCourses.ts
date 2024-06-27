import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const newCourses = req.body;

    // Define the path to availableCourses.json
    const filePath = path.join(process.cwd(), 'public', 'data', 'availableCourses.json');

    // Write the new course data to the file
    fs.writeFile(filePath, JSON.stringify(newCourses, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to save courses' });
      }
      return res.status(200).json({ message: 'Courses saved successfully' });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
};
