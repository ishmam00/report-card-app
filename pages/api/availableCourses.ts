import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

const availableCoursesFilePath = path.join(process.cwd(), 'data', 'availableCourses.json');
const availableCoursesData = require(availableCoursesFilePath);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json({ courses: availableCoursesData });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
