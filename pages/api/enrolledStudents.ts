import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { courseName } = req.query;

  const filePath = path.join(process.cwd(), 'public', 'data', 'courseEnrollment.json');
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  const courseEnrollmentData = JSON.parse(jsonData);

  const enrolledStudents = courseEnrollmentData[courseName as string] || [];

  res.status(200).json({ students: enrolledStudents });
}
