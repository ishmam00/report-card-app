import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useCurrentUser from '@/hooks/useCurrentUser';
import { Course } from './CourseEnrollment';
import PrivateRouter from '@/components/privateRouter';
import convertMarksToGrade from '../utils/convertMarksToGrade';

interface StudentResult {
  courseName: string;
  mark?: number;
}

const StudentDashboard = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(false);

  const [user] = useCurrentUser();

  const fetchEnrolledCourses = async () => {
    setLoading(true);
    try {
      const userDataString = localStorage.getItem('user');
      if (!userDataString) {
        throw new Error('User data not found in localStorage');
      }
      const userData = JSON.parse(userDataString);
      const studentId = userData.id;

      const res = await fetch(`/api/enrolledCourses?studentId=${studentId}`);
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses);
      } else {
        throw new Error('Failed to fetch enrolled courses');
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentResults = async () => {
    setLoading(true);
    try {
      const userDataString = localStorage.getItem('user');
      if (!userDataString) {
        throw new Error('User data not found in localStorage');
      }
      const userData = JSON.parse(userDataString);
      const studentId = userData.id;

      const res = await fetch(`/api/getStudentResults?studentId=${studentId}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.studentResults);
      } else {
        throw new Error('Failed to fetch student results');
      }
    } catch (error) {
      console.error('Error fetching student results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollment = () => {
    router.push('/CourseEnrollment');
  };

  const getGradeForCourse = (courseName: string) => {
    const result = results.find((r) => r.courseName === courseName);
    if (result && result.mark !== undefined) {
      return convertMarksToGrade(result.mark);
    }
    return 'N/A';
  };

  useEffect(() => {
    if (user) {
      fetchEnrolledCourses();
      fetchStudentResults();
    }
  }, [user]);

  // console.log('Hello World');

  return (
    <PrivateRouter>
      <div className="flex h-screen bg-gray-100">
        {/* Side Panel */}
        <div className="bg-gray-100 shadow-md w-64 flex flex-col p-4">
          <h2 className="text-gray-700 text-lg font-bold mb-4">Actions</h2>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 mb-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleEnrollment}
          >
            Course Management
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full h-full">
            <h1 className="text-gray-700 text-2xl mb-4">Student Dashboard</h1>
            {loading ? (
              <p className="text-gray-700">Loading...</p>
            ) : (
              <>
                <h2 className="text-gray-700 text-lg my-4">
                  Enrolled Courses:
                </h2>
                {courses.length > 0 && courses[0] != null ? (
                  <div className="overflow-x-auto w-full">
                    <table className="min-w-full bg-white border">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 bg-gray-200 border-b text-left text-gray-700">
                            Id
                          </th>
                          <th className="py-2 px-4 bg-gray-200 border-b text-left text-gray-700">
                            Name
                          </th>
                          <th className="py-2 px-4 bg-gray-200 border-b text-left text-gray-700">
                            Description
                          </th>
                          <th className="py-2 px-4 bg-gray-200 border-b text-left text-gray-700">
                            Instructor
                          </th>
                          <th className="py-2 px-4 bg-gray-200 border-b text-left text-gray-700">
                            Grade
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {courses.map((course, index) => (
                          <tr key={index}>
                            <td className="py-2 px-4 border-b text-gray-700">
                              {course.id}
                            </td>
                            <td className="py-2 px-4 border-b text-gray-700">
                              {course.name}
                            </td>
                            <td className="py-2 px-4 border-b text-gray-700">
                              {course.description}
                            </td>
                            <td className="py-2 px-4 border-b text-gray-700">
                              {course.instructor}
                            </td>
                            <td className="py-2 px-4 border-b text-gray-700">
                              {getGradeForCourse(course.name)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-gray-700">
                    There are no enrolled courses at the moment.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </PrivateRouter>
  );
};

export default StudentDashboard;
