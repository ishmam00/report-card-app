import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { Course } from '../CourseEnrollment';

const courseEnrollmentFilePath = path.join(process.cwd(), 'public', 'data', 'courseEnrollment.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const studentName = req.query.studentName as string;
    try {
      // Read course enrollment data
      const data = fs.readFileSync(courseEnrollmentFilePath, 'utf-8');
      const courseEnrollmentData = JSON.parse(data);

      // Filter courses based on student ID
      const enrolledCourses = Object.keys(courseEnrollmentData).filter(
        (course) => courseEnrollmentData[course].includes(studentName)
      );

      res.status(200).json({ courses: enrolledCourses });
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      res.status(500).json({ error: 'Failed to fetch enrolled courses' });
    }
  } else if (req.method === 'POST') {
    const { courses, student } = req.body;
    try {
      // Read current course enrollment data
      const data = fs.readFileSync(courseEnrollmentFilePath, 'utf-8');
      const courseEnrollmentData = JSON.parse(data);
      console.log(courses, courseEnrollmentData, student);

      // Add student to course enrollments
      courses.forEach((course: Course) => {
        if (!courseEnrollmentData[course.name]) {
          courseEnrollmentData[course.name] = [student];
        } else {
          courseEnrollmentData[course.name].push(student);
        }
      });
      // console.log(courseEnrollmentData)

      // Write updated course enrollment data back to the file
      fs.writeFileSync(courseEnrollmentFilePath, JSON.stringify(courseEnrollmentData, null, 2));

      res.status(200).json({ message: 'Enrollment successful' });
    } catch (error) {
      console.error('Error enrolling student in courses:', error);
      res.status(500).json({ error: 'Failed to enroll student in courses' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
