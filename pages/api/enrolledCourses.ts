import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { Course } from '../CourseEnrollment';

const courseEnrollmentFilePath = path.join(process.cwd(), 'public', 'data', 'courseEnrollment.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const studentId = req.query.studentId as string;
    try {
      // Read course enrollment data
      const data = fs.readFileSync(courseEnrollmentFilePath, 'utf-8');
      const courseEnrollmentData = JSON.parse(data);

      const courseData = fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'availableCourses.json'), 'utf-8');
      const availableCourses = JSON.parse(courseData);

      const matchingCourses: any[] = []

      // Filter courses based on student ID
      Object.keys(courseEnrollmentData).forEach(
        (course) => {
          const enrolledStudent = courseEnrollmentData[course].find((student: any) => student.id == studentId);
          if (enrolledStudent) {
            const result = availableCourses.find((availableCourse: Course) => availableCourse.name === course);
            if (result) {
              matchingCourses.push({
                ...result,
                hasGrade: enrolledStudent.mark !== undefined
              });
            }
          }
        }
      );

      res.status(200).json({ courses: matchingCourses });
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

      // Add student to course enrollments
      courses.forEach((course: Course) => {
        if (!courseEnrollmentData[course.name]) {
          courseEnrollmentData[course.name] = [student];
        } else {
          // Prevent duplicate enrollments
          if (!courseEnrollmentData[course.name].some((enrolledStudent: any) => enrolledStudent.id === student.id)) {
            courseEnrollmentData[course.name].push(student);
          }
        }
      });

      // Write updated course enrollment data back to the file
      fs.writeFileSync(courseEnrollmentFilePath, JSON.stringify(courseEnrollmentData, null, 2));

      res.status(200).json({ message: 'Enrollment successful' });
    } catch (error) {
      console.error('Error enrolling student in courses:', error);
      res.status(500).json({ error: 'Failed to enroll student in courses' });
    }
  } else if (req.method === 'DELETE') {
    const { course, studentId } = req.body;
    try {
      // Read current course enrollment data
      const data = fs.readFileSync(courseEnrollmentFilePath, 'utf-8');
      const courseEnrollmentData = JSON.parse(data);

      // Remove student from course enrollments
      if (courseEnrollmentData[course]) {
        courseEnrollmentData[course] = courseEnrollmentData[course].filter((student: any) => student.id !== studentId);
      }

      // Write updated course enrollment data back to the file
      fs.writeFileSync(courseEnrollmentFilePath, JSON.stringify(courseEnrollmentData, null, 2));

      res.status(200).json({ message: 'Unenrollment successful' });
    } catch (error) {
      console.error('Error unenrolling student from course:', error);
      res.status(500).json({ error: 'Failed to unenroll student from course' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
