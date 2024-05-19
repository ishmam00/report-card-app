import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import privateRouter from '@/components/privateRouter';
import useCurrentUser from '@/hooks/useCurrentUser';

const TeacherDashboard: React.FC = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [user] = useCurrentUser();

  useEffect(() => {
    if (!user) {
      router.push('/LoginPage');
    }
  }, []);

  const fetchTaughtCourses = async () => {};

  useEffect(() => {
    // Fetch courses taught by the teacher (you need to implement this)
    // fetchTaughtCourses()
    //   .then((taughtCourses) => {
    //     setCourses(taughtCourses);
    //     setLoading(false);
    //   })
    //   .catch((error) => {
    //     console.error('Error fetching taught courses:', error);
    //     setLoading(false);
    //   });
  }, []);

  const handleLogout = () => {
    // Logout logic (you need to implement this)
    router.push('/LoginPage');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/3">
        <h1 className="text-2xl mb-4 text-gray-700">Teacher Dashboard</h1>
        {loading ? (
          <p className="text-gray-700">Loading...</p>
        ) : (
          <>
            <h2 className="text-lg mb-2 text-gray-700">Taught Courses:</h2>
            <ul>
              {courses.map((course) => (
                <li key={course} className="text-gray-700">
                  {course}
                </li>
              ))}
            </ul>
          </>
        )}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default TeacherDashboard;
