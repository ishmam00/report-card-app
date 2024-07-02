// pages/AddCourses.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useCurrentUser from '@/hooks/useCurrentUser';
import availableCourses from '../public/data/availableCourses.json';
import { Course } from './CourseEnrollment';

const AddCourses = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const { user } = useCurrentUser();

  useEffect(() => {
    setCourses(availableCourses);
  }, []);

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim()) {
      setError('Please fill in all fields');
      return;
    }

    const existingCourse = availableCourses.find(
      (course) => course.name === name
    );

    if (existingCourse) {
      setError('Course already exists');
      return;
    }

    const newCourse = {
      id: availableCourses.length + 1,
      name,
      description,
      instructor: `Prof. ${user.name}`,
    };

    const updatedCourses = [...availableCourses, newCourse];

    try {
      const res = await fetch('/api/saveCourses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCourses),
      });

      if (res.ok) {
        router.push('/TeacherDashboard');
      } else {
        setError('Failed to add course');
      }
    } catch (error) {
      console.error('Error adding course:', error);
      setError('Failed to add course');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="bg-gray-100 shadow-md w-64 flex flex-col p-4">
        <h2 className="text-gray-700 text-lg font-bold mb-4">Actions</h2>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 mb-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => router.push('/TeacherDashboard')}
        >
          Back to Dashboard
        </button>
      </div>

      <div className="flex h-screen w-full bg-gray-100">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full h-full">
          <h2 className="text-2xl mb-4 text-gray-700">Available Courses</h2>
          {courses.length > 0 ? (
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
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-700">No courses available</p>
          )}
        </div>

        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 h-full w-full"
          onSubmit={handleAddCourse}
        >
          <h2 className="text-2xl mb-4 text-gray-700">Add New Course</h2>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Course Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Course Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Course Description
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              id="description"
              type="text"
              placeholder="Course Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Add Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourses;
