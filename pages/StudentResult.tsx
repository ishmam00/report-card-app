// Didn't use this file in the project

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useCurrentUser from '@/hooks/useCurrentUser';
import convertMarksToGrade from '../utils/convertMarksToGrade';
import PrivateRouter from '@/components/privateRouter';

interface StudentResult {
  courseName: string;
  mark?: number;
}

const StudentResult = () => {
  const router = useRouter();
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [user] = useCurrentUser();

  useEffect(() => {
    if (user) fetchStudentResults();
  }, [user]);

  const fetchStudentResults = async () => {
    try {
      const userDataString = localStorage.getItem('user');
      if (!userDataString) {
        throw new Error('User data not found in localStorage');
      }
      const userData = JSON.parse(userDataString);
      const studentId = userData.id;

      const res = await fetch(`/api/getStudentResults?studentId=${studentId}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.studentResults);
      } else {
        throw new Error('Failed to fetch student results');
      }
    } catch (error) {
      console.error('Error fetching student results:', error);
    } finally {
      setLoading(false);
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

      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full h-full">
          <h1 className="text-gray-700 text-2xl mb-4">Student Results</h1>
          {loading ? (
            <p className="text-gray-700">Loading...</p>
          ) : results.length > 0 ? (
            <div className="overflow-x-auto w-full">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="py-2 px-4 bg-gray-200 border-b text-left text-gray-700">
                      Course Name
                    </th>
                    <th className="py-2 px-4 bg-gray-200 border-b text-left text-gray-700">
                      Grade
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b text-gray-700">
                        {result.courseName}
                      </td>
                      <td className="py-2 px-4 border-b text-gray-700">
                        {result.mark !== undefined
                          ? convertMarksToGrade(result.mark)
                          : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-gray-700">No results available.</div>
          )}
        </div>
      </div>
    </div>
    </PrivateRouter>
  );
};

export default StudentResult;
