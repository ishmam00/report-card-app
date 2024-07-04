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
  const [enrollmentRequests, setEnrollmentRequests] = useState<any[]>([]);
  const { user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <PrivateRouter>
        <main>
          <div className="flex justify-center text-gray-700 mb-3">
            Loading...
          </div>
        </main>
      </PrivateRouter>
    );
  }
  // if (!user && router.isReady) {
  //   router.push('/LoginPage');
  // }

  const fetchTaughtCourses = async () => {
    setLoading(true);
    try {
      const instructorName = user?.name;
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
      setCourses(taughtCourses);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching taught courses:', error);
      setLoading(false);
    }
  };

  const fetchEnrollmentRequests = async () => {
    try {
      const res = await fetch('/data/enrollmentRequests.json');
      const data = await res.json();
      const instructorName = user?.name;

      const pendingRequests = data.filter((course: any) => {
        const replacedInstructorName = (
          course.course.instructor.replace('Prof. ', '') as string
        ).toLowerCase();
        if (
          replacedInstructorName === instructorName?.toLowerCase() &&
          course.status === 'pending'
        )
          return course;
      });
      setEnrollmentRequests(pendingRequests);
    } catch (error) {
      console.error('Error fetching enrollment requests:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTaughtCourses();
      fetchEnrollmentRequests();
    }
  }, [user]);

  const handleCourseClick = (courseName: string) => {
    router.push(`/CourseStudents?courseName=${courseName}`);
  };

  const handleEnrollmentRequest = async (
    requestId: number,
    status: 'approved' | 'rejected'
  ) => {
    try {
      const res = await fetch('/api/handleEnrollmentRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId, status }),
      });

      if (res.ok) {
        fetchEnrollmentRequests(); // Refresh requests
      } else {
        throw new Error('Failed to handle enrollment request');
      }
    } catch (error) {
      console.error('Error handling enrollment request:', error);
    }
  };

  console.log('Enrollment requests:', enrollmentRequests);

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

              <h2 className="text-lg mb-2 text-gray-700 mt-4">
                Enrollment Requests:
              </h2>
              {enrollmentRequests.length > 0 ? (
                <div className="overflow-x-auto w-full">
                  <table className="min-w-full bg-white border">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 bg-gray-200 border-b text-left text-gray-700">
                          Student
                        </th>
                        <th className="py-2 px-4 bg-gray-200 border-b text-left text-gray-700">
                          Course
                        </th>
                        <th className="py-2 px-4 bg-gray-200 border-b text-left text-gray-700">
                          Status
                        </th>
                        <th className="py-2 px-4 bg-gray-200 border-b text-left text-gray-700">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrollmentRequests.map((request) => (
                        <tr key={request.id}>
                          <td className="py-2 px-4 border-b text-gray-700">
                            {request.student.name}
                          </td>
                          <td className="py-2 px-4 border-b text-gray-700">
                            {request.course.name}
                          </td>
                          <td className="py-2 px-4 border-b text-gray-700">
                            {request.status.charAt(0).toUpperCase() +
                              request.status.slice(1)}
                          </td>
                          <td className="py-2 px-4 border-b text-gray-700">
                            <button
                              className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                              onClick={() =>
                                handleEnrollmentRequest(request.id, 'approved')
                              }
                            >
                              Approve
                            </button>
                            <button
                              className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                              onClick={() =>
                                handleEnrollmentRequest(request.id, 'rejected')
                              }
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-gray-700">
                  No pending enrollment requests at the moment.
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
