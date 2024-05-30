import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useCurrentUser from '@/hooks/useCurrentUser';
import { Course } from './CourseEnrollment';
import PrivateRouter from '@/components/privateRouter';
import availableCourses from '../public/data/availableCourses.json';

const AddMarks = () => {
  const router = useRouter();
  const [user] = useCurrentUser();
  const [enrolledStudents, setEnrolledStudents] = useState<
    { name: string; course: string; mark: number }[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchEnrolledStudents();
  }, [user]);

  const fetchEnrolledStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/enrolledCourses?studentId=${user.id}`);
      // console.log('Response:', res);
      const data = await res.json();
      // console.log('Data:', data);
      const courses = data.courses;
      // console.log('Courses:', courses);
      const students: { name: string; course: string; mark: number }[] = [];
      for (const course of courses) {
        const res = await fetch(
          `/api/getStudentsByCourse?course=${course.name}`
        );
        const data = await res.json();
        for (const student of data.students) {
          students.push({ name: student, course: course.name, mark: 0 });
        }
      }
      setEnrolledStudents(students);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const handleMarkUpdate = (studentIndex: number, newMark: number) => {
    const updatedStudents = [...enrolledStudents];
    updatedStudents[studentIndex].mark = newMark;
    setEnrolledStudents(updatedStudents);
  };

  const saveMarks = async () => {
    try {
      // Update the availableCourses.json file
      await fetch('/api/saveMarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enrolledStudents),
      });
      console.log('Marks saved successfully');
    } catch (error) {
      console.error('Error saving marks:', error);
    }
  };

  return (
    <PrivateRouter>
      <div className="flex h-screen bg-gray-100">
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full h-full">
            <h1 className="text-2xl mb-4 text-gray-700">Add Marks</h1>
            {loading ? (
              <p className="text-gray-700">Loading...</p>
            ) : (
              <div>
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 bg-gray-200 border-b text-left text-gray-700">
                        Student Name
                      </th>
                      <th className="py-2 px-4 bg-gray-200 border-b text-left text-gray-700">
                        Course
                      </th>
                      <th className="py-2 px-4 bg-gray-200 border-b text-left text-gray-700">
                        Mark
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrolledStudents.map((student, index) => (
                      <tr key={index}>
                        <td className="py-2 px-4 border-b text-gray-700">
                          {student.name}
                        </td>
                        <td className="py-2 px-4 border-b text-gray-700">
                          {student.course}
                        </td>
                        <td className="py-2 px-4 border-b text-gray-700">
                          <input
                            type="number"
                            className="border rounded px-2 py-1"
                            value={student.mark}
                            onChange={(e) =>
                              handleMarkUpdate(index, parseInt(e.target.value))
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 mt-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={saveMarks}
                >
                  Save Marks
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PrivateRouter>
  );
};

export default AddMarks;
