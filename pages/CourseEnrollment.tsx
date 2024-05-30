import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useCurrentUser from '@/hooks/useCurrentUser';
import PrivateRouter from '@/components/privateRouter';

export interface Course {
  id: number;
  name: string;
  description?: string;
  instructor?: string;
}

const CourseEnrollment: React.FC = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

  const [user] = useCurrentUser();

  useEffect(() => {
    if (user) {
      // Fetch available courses
      fetchAvailableCourses();
    }
  }, [user]);

  // const [user] = useCurrentUser();

  const fetchAvailableCourses = async () => {
    try {
      const res = await fetch('./data/availableCourses.json');
      const data: Course[] = await res.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching available courses:', error);
    }
  };

  const handleCourseSelection = (course: Course) => {
    if (
      selectedCourses.findIndex((oldCourse) => oldCourse.id === course.id) > -1
    ) {
      setSelectedCourses(
        selectedCourses.filter((oldCourse) => oldCourse.id !== course.id)
      );
    } else {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  // console.log('Selected Courses: ', selectedCourses);

  const handleEnroll = async () => {
    try {
      // Send a request to update the JSON file with the student's enrollment information
      const userDataString = localStorage.getItem('user');
      if (!userDataString) {
        throw new Error('User data not found in localStorage');
      }
      const userData = JSON.parse(userDataString);

      const res = await fetch('/api/enrolledCourses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courses: selectedCourses,
          student: { name: userData.name, id: userData.id },
        }),
      });

      if (res.ok) {
        console.log('Enrollment successful');
        router.push('/StudentDashboard');
      } else {
        throw new Error('Failed to enroll in courses');
      }
    } catch (error) {
      console.error('Error enrolling in courses:', error);
    }
  };

  return (
    <PrivateRouter>
      <div className="flex h-screen bg-gray-100">
        <div className="bg-gray-100 shadow-md w-64 flex flex-col p-4">
          <h2 className="text-gray-700 text-lg font-bold mb-4">Actions</h2>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 mb-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => router.push('/StudentDashboard')}
          >
            Back to Dashboard
          </button>
        </div>

        <div className="flex-1 justify-center items-center">
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 h-full w-full">
            <h2 className="text-2xl mb-4 text-gray-700">Course Enrollment</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Select Courses
              </label>
              {courses.map((course) => (
                <label key={course.id} className="block text-gray-700">
                  <input
                    type="checkbox"
                    checked={
                      selectedCourses.findIndex(
                        (oldCourse) => oldCourse.id === course.id
                      ) > -1
                    }
                    onChange={() => handleCourseSelection(course)}
                  />
                  {course.name}
                </label>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={handleEnroll}
              >
                Enroll
              </button>
            </div>
          </form>
        </div>
      </div>
    </PrivateRouter>
  );
};

export default CourseEnrollment;
