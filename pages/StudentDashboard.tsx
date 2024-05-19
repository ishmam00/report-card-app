import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useCurrentUser from '@/hooks/useCurrentUser';
import { Course } from './CourseEnrollment';

const StudentDashboard: React.FC = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Object.keys(localStorage).length === 0) {
      router.push('/LoginPage');
    }
  }, []);

  useEffect(() => {
    fetchEnrolledCourses()
      .then((enrolledCourses) => {
        setCourses(enrolledCourses);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching enrolled courses:', error);
        setLoading(false);
      });
  }, []);

  const [user] = useCurrentUser();

  const fetchEnrolledCourses = async () => {
    try {
      const userDataString = localStorage.getItem('user');
      if (!userDataString) {
        throw new Error('User data not found in localStorage');
      }
      const userData = JSON.parse(userDataString);
      const studentId = userData.id;

      const res = await fetch(`/api/enrolledCourses?studentId=${studentId}`); // Replace 'studentId' with the actual student ID
      if (res.ok) {
        const data: Course[] = await res.json();
        setCourses(data); // Assuming the API response has a 'courses' property containing the enrolled courses
      } else {
        throw new Error('Failed to fetch enrolled courses');
      }
    } catch (error) {
      throw new Error('Failed to fetch enrolled courses');
    }
  };

  const handleEnrollment = () => {
    // Navigate to the CourseEnrollment page
    router.push('/CourseEnrollment');
  };

  const handleShowResult = () => {
    router.push('/StudentResult');
  };

  const handleLogout = () => {
    // Logout logic
    localStorage.removeItem('user');
    router.push('/LoginPage');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full h-full flex flex-col items-center justify-center">
        <h1 className="text-gray-700 text-2xl mb-4">Student Dashboard</h1>
        {loading ? (
          <p className="text-gray-700">Loading...</p>
        ) : (
          <div className="flex items-center justify-center w-full">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleEnrollment}
            >
              Enroll in Courses
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => handleShowResult()}
            >
              Show Result
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
        <h2 className="text-gray-700 text-lg my-4">Enrolled Courses:</h2>
        <ul>
          {courses?.map((course) => (
            <li key={course.id} className="text-gray-700">
              {course.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudentDashboard;
