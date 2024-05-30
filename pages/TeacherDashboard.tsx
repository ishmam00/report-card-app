import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useCurrentUser from '@/hooks/useCurrentUser';
import { Course } from './CourseEnrollment';
import PrivateRouter from '@/components/privateRouter';
import availableCourses from '../public/data/availableCourses.json';
import Link from 'next/link';

const TeacherDashboard = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  const [user] = useCurrentUser();

  const fetchTaughtCourses = async () => {
    setLoading(true);
    try {
      const instructorName = user?.name;
      const taughtCourses = availableCourses.filter(
        (course: Course) =>
          course.instructor?.replace('Prof. ', '') == instructorName
      );

      setCourses(taughtCourses);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching taught courses:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTaughtCourses();
    }
  }, [user]);

  const handleCourseClick = (courseName: string) => {
    router.push(`/CourseStudents?courseName=${courseName}`);
  };

  return (
    <PrivateRouter>
      <div className="flex h-screen bg-gray-100">
        <div className="bg-gray-100 shadow-md w-64 flex flex-col p-4">
          <h2 className="text-gray-700 text-lg font-bold mb-4">Actions</h2>
          <Link href="/AddMarks">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 mr-4 w-11/12 rounded focus:outline-none focus:shadow-outline">
              Add Marks
            </button>
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full h-full">
            <h1 className="text-2xl mb-4 text-gray-700">Teacher Dashboard</h1>
            <h1 className="text-gray-700 text-lg mb-4">
              Welcome, <strong>{user.name}</strong>
            </h1>
            {loading ? (
              <p className="text-gray-700">Loading...</p>
            ) : (
              <div>
                <h2 className="text-lg mb-2 text-gray-700 mt-4">
                  Taught Courses:
                </h2>
                {courses.length > 0 && courses[0] != null ? (
                  <div className="overflow-x-auto w-full">
                    <table className="min-w-full bg-white border">
                      <thead>
                        <tr>
                          {Object.keys(courses[0]).map((key) => (
                            <th
                              key={key}
                              className="py-2 px-4 bg-gray-200 border-b text-left text-gray-700"
                            >
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {courses.map((course, index) => (
                          <tr
                            key={index}
                            className="cursor-pointer"
                            onClick={() => handleCourseClick(course.name)}
                          >
                            {Object.keys(course).map((key) => (
                              <td
                                key={key}
                                className="py-2 px-4 border-b text-gray-700"
                              >
                                {course[key as keyof Course]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-gray-700">
                    You are not teaching any courses at the moment.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </PrivateRouter>
  );
};

export default TeacherDashboard;
