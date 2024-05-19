import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useCurrentUser from '@/hooks/useCurrentUser';
import { idText } from 'typescript';

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

  useEffect(() => {
    // Fetch available courses
    fetchAvailableCourses();
  }, []);

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
    <div className="flex justify-center items-center h-screen">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/3">
        <h2 className="text-2xl mb-4">Course Enrollment</h2>
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
  );
};

export default CourseEnrollment;
