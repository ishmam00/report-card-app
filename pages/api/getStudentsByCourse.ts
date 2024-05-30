import courseEnrollmentData from '../../public/data/courseEnrollment.json';
import { NextApiRequest, NextApiResponse } from 'next';


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { course } = req.query;
  // console.log('Course:', course)

  if (!course) {
    return res.status(400).json({ error: 'Course parameter is required' });
  }

  try {
    const students = courseEnrollmentData[course as keyof typeof courseEnrollmentData].map((student) => student.name);
    // console.log('Students:', students);
    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students for the course' });
  }
}
