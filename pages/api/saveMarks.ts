import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { courseName, studentId, mark } = req.body;

    const filePath = path.join(process.cwd(), 'public', 'data', 'courseEnrollment.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const courseEnrollmentData = JSON.parse(jsonData);

    if (!courseEnrollmentData[courseName]) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const studentIndex = courseEnrollmentData[courseName].findIndex((student: any) => student.id === studentId);
    if (studentIndex === -1) {
      return res.status(404).json({ error: 'Student not found' });
    }

    courseEnrollmentData[courseName][studentIndex].mark = mark;

    fs.writeFileSync(filePath, JSON.stringify(courseEnrollmentData, null, 2));

    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
