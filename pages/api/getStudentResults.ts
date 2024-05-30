import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { studentId } = req.query;

    const filePath = path.join(process.cwd(), 'public', 'data', 'courseEnrollment.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const courseEnrollmentData = JSON.parse(jsonData);

    const studentResults = [];

    for (const courseName in courseEnrollmentData) {
      const students = courseEnrollmentData[courseName];
      const student = students.find((s: any) => s.id == studentId);
      if (student) {
        studentResults.push({
          courseName,
          mark: student.mark,
        });
      }
    }

    res.status(200).json({ studentResults });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
