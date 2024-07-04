import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useCurrentUser from '@/hooks/useCurrentUser';
import PrivateRouter from '@/components/privateRouter';
import ConfirmationModal from '@/components/ConfirmationModal';
import Modal from '@/components/Modal';

export interface Course {
  id: number;
  name: string;
  description?: string;
  instructor?: string;
  studentCount?: number;
  hasGrade?: boolean;
}

const CourseEnrollment: React.FC = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const { user } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<'enrolled' | 'available'>(
    'enrolled'
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseToUnenroll, setCourseToUnenroll] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAvailableCourses();
      fetchEnrolledCourses(user.id);
    }
  }, [user]);

  const fetchAvailableCourses = async () => {
    try {
      const res = await fetch('/data/availableCourses.json');
      const data: Course[] = await res.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching available courses:', error);
    }
  };

  const fetchEnrolledCourses = async (studentId: number) => {
    try {
      const res = await fetch(`/api/enrolledCourses?studentId=${studentId}`);
      const data = await res.json();
      setEnrolledCourses(data.courses);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    }
  };

  const handleCourseSelection = (course: Course) => {
    if (selectedCourses.find((oldCourse) => oldCourse.id === course.id)) {
      setSelectedCourses(
        selectedCourses.filter((oldCourse) => oldCourse.id !== course.id)
      );
    } else {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  // const handleEnroll = async () => {
  // try {
  // const userDataString = localStorage.getItem('user');
  // if (!userDataString) {
  //   throw new Error('User data not found in localStorage');
  // }
  // const userData = JSON.parse(userDataString);

  //     const res = await fetch('/api/enrolledCourses', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         courses: selectedCourses,
  //         student: { name: userData.name, id: userData.id },
  //       }),
  //     });

  //     if (res.ok) {
  //       setShowModal(true);
  //       console.log('Enrollment successful');
  //       fetchEnrolledCourses(userData.id); // Refresh enrolled courses
  //     } else {
  //       throw new Error('Failed to enroll in courses');
  //     }
  //   } catch (error) {
  //     console.error('Error enrolling in courses:', error);
  //   }
  // };

  const handleEnrollRequest = async () => {
    try {
      const userDataString = localStorage.getItem('user');
      if (!userDataString) {
        throw new Error('User data not found in localStorage');
      }
      const userData = JSON.parse(userDataString);

      const res = await fetch('/api/enrollRequest', {
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
        setShowModal(true);
        // fetchEnrolledCourses(userData.id); // Refresh enrolled courses
        setSelectedCourses([]); // Clear selected courses after request
      } else {
        throw new Error('Failed to send enrollment request');
      }
    } catch (error) {
      console.error('Error sending enrollment request:', error);
    }
  };

  const handleUnenrollClick = (courseName: string) => {
    setCourseToUnenroll(courseName);
    setIsModalOpen(true);
  };

  const handleUnenroll = async () => {
    if (!courseToUnenroll) return;

    try {
      const userDataString = localStorage.getItem('user');
      if (!userDataString) {
        throw new Error('User data not found in localStorage');
      }
      const userData = JSON.parse(userDataString);

      const res = await fetch('/api/enrolledCourses', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course: courseToUnenroll,
          studentId: userData.id,
        }),
      });

      if (res.ok) {
        console.log('Unenrollment successful');
        fetchEnrolledCourses(userData.id); // Refresh enrolled courses
      } else {
        throw new Error('Failed to unenroll from course');
      }
    } catch (error) {
      console.error('Error unenrolling from course:', error);
    } finally {
      setIsModalOpen(false);
      setCourseToUnenroll(null);
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
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 h-full w-full">
            <h2 className="text-2xl mb-4 text-gray-700">Course Enrollment</h2>
            <div className="mb-4">
              <div className="flex mb-4">
                <button
                  className={`px-4 py-2 rounded-t-lg ${
                    activeTab === 'enrolled'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  } mr-2`}
                  onClick={() => setActiveTab('enrolled')}
                >
                  Enrolled Courses
                </button>
                <button
                  className={`px-4 py-2 rounded-t-lg ${
                    activeTab === 'available'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => setActiveTab('available')}
                >
                  More Courses
                </button>
              </div>
              <div className="overflow-x-auto">
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
                      {activeTab === 'available' && (
                        <th className="py-2 px-4 bg-gray-200 border-b text-left text-gray-700">
                          Select
                        </th>
                      )}
                      {activeTab === 'enrolled' && (
                        <th className="py-2 px-4 bg-gray-200 border-b text-left text-gray-700">
                          Unenroll
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {activeTab === 'enrolled' &&
                      enrolledCourses.map((course) => (
                        <tr key={course.id} className="cursor-pointer">
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
                            <button
                              className={`font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                                course.hasGrade
                                  ? 'bg-gray-400 cursor-not-allowed'
                                  : 'bg-red-500 hover:bg-red-700 text-white'
                              }`}
                              onClick={() => handleUnenrollClick(course.name)}
                            >
                              Unenroll
                            </button>
                          </td>
                        </tr>
                      ))}
                    {activeTab === 'available' &&
                      courses
                        .filter(
                          (course) =>
                            !enrolledCourses.some(
                              (enrolledCourse) =>
                                enrolledCourse.id === course.id
                            )
                        )
                        .map((course) => (
                          <tr key={course.id} className="cursor-pointer">
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
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={selectedCourses.some(
                                    (oldCourse) => oldCourse.id === course.id
                                  )}
                                  onChange={() => handleCourseSelection(course)}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
            {activeTab === 'available' && (
              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={handleEnrollRequest}
                >
                  Enroll
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {showModal && (
        <Modal
          message="Request sent to the corresponding faculty"
          onClose={() => setShowModal(false)}
        />
      )}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleUnenroll}
        message="Do you wish to unenroll?"
      />
    </PrivateRouter>
  );
};

export default CourseEnrollment;
