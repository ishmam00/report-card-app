import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useCurrentUser from '@/hooks/useCurrentUser';
import { Course } from './CourseEnrollment';
import PrivateRouter from '@/components/privateRouter';
import availableCourses from '../public/data/availableCourses.json';
import courseEnrollments from '../public/data/courseEnrollment.json';
import Link from 'next/link';

const TeacherDashboard = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  const { user } = useCurrentUser();

  const fetchTaughtCourses = async () => {
    setLoading(true);
    try {
      const instructorName = user.name;
      const taughtCourses = availableCourses
        .filter(
          (course: Course) =>
            course.instructor?.replace('Prof. ', '') === instructorName
        )
        .map((course) => {
          const studentCount =
            (courseEnrollments as { [key: string]: any })[course.name]
              ?.length || 0;
          return {
            ...course,
            studentCount,
          };
        });
      // console.log('Taught Courses: ', taughtCourses);
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

  // const handleAddCourses = () => {};

  // console.log('Hello World');

  return (
    <PrivateRouter>
      <div className="flex h-screen bg-gray-100">
        {/* Side Panel */}
        <div className="bg-gray-100 shadow-md w-64 flex flex-col p-4">
          <h2 className="text-gray-700 text-lg font-bold mb-4">Actions</h2>
          <Link href="/AddCourses">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 mb-4 w-full rounded focus:outline-none focus:shadow-outline">
              Add Courses
            </button>
          </Link>
        </div>

        <div className="flex h-screen w-full bg-gray-100">
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full h-full">
              <h1 className="text-2xl mb-4 text-gray-700">Teacher Dashboard</h1>
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
                              Student Count
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {courses.map((course, index) => (
                            <tr
                              key={index}
                              className="cursor-pointer"
                              onClick={() => handleCourseClick(course.name)}
                            >
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
                                {course.studentCount}
                              </td>
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
      </div>
    </PrivateRouter>
  );
};

export default TeacherDashboard;
