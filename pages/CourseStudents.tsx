import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PrivateRouter from '@/components/privateRouter';

interface Student {
  name: string;
  id: number;
  mark?: number;
}

const CourseStudents = () => {
  const router = useRouter();
  const { courseName } = router.query;
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [marks, setMarks] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    if (courseName) {
      fetchEnrolledStudents(courseName as string);
    }
  }, [courseName]);

  const fetchEnrolledStudents = async (courseName: string) => {
    try {
      const res = await fetch(`/api/enrolledStudents?courseName=${courseName}`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students);
        const initialMarks: { [key: number]: number } = {};
        data.students.forEach((student: Student) => {
          initialMarks[student.id] = student.mark || 0;
        });
        setMarks(initialMarks);
      } else {
        console.error('Failed to fetch enrolled students');
      }
    } catch (error) {
      console.error('Error fetching enrolled students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkChange = (studentId: number, mark: number) => {
    setMarks((prevMarks) => ({
      ...prevMarks,
      [studentId]: mark,
    }));
  };

  const handleSaveMark = async (studentId: number) => {
    try {
      const mark = marks[studentId];
      const res = await fetch('/api/saveMarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseName,
          studentId,
          mark,
        }),
      });

      if (res.ok) {
        console.log('Mark saved successfully');
      } else {
        console.error('Failed to save mark');
      }
    } catch (error) {
      console.error('Error saving mark:', error);
    }
  };

  return (
    <PrivateRouter>
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
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full h-full">
              <h1 className="text-2xl mb-4 text-gray-700">Enrolled Students</h1>
              {loading ? (
                <p className="text-gray-700">Loading...</p>
              ) : (
                <div>
                  {students.length > 0 ? (
                    <div className="overflow-x-auto w-full">
                      <table className="min-w-full bg-white border">
                        <thead>
                          <tr>
                            <th className="py-2 px-4 bg-gray-200 border-b text-left text-gray-700">
                              ID
                            </th>
                            <th className="py-2 px-4 bg-gray-200 border-b text-left text-gray-700">
                              Name
                            </th>
                            <th className="py-2 px-4 bg-gray-200 border-b text-left text-gray-700">
                              Mark
                            </th>
                            <th className="py-2 px-4 bg-gray-200 border-b text-left text-gray-700">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student) => (
                            <tr key={student.id}>
                              <td className="py-2 px-4 border-b text-gray-700">
                                {student.id}
                              </td>
                              <td className="py-2 px-4 border-b text-gray-700">
                                {student.name}
                              </td>
                              <td className="py-2 px-4 border-b text-gray-700">
                                <input
                                  type="number"
                                  value={marks[student.id]}
                                  onChange={(e) =>
                                    handleMarkChange(
                                      student.id,
                                      parseInt(e.target.value, 10)
                                    )
                                  }
                                  className="border rounded px-2 py-1"
                                />
                              </td>
                              <td className="py-2 px-4 border-b text-gray-700">
                                <button
                                  onClick={() => handleSaveMark(student.id)}
                                  className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                                >
                                  Save
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-gray-700">
                      No students enrolled in this course.
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

export default CourseStudents;
