import useCurrentUser from '@/hooks/useCurrentUser';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const PrivateRouter = ({ children }: { children: React.ReactNode }) => {
  const studentAccess = ['/StudentDashboard', '/CourseEnrollment'];
  const teacherAccess = ['/TeacherDashboard', '/CourseStudents', '/AddMarks'];

  const router = useRouter();

  const [user] = useCurrentUser();
  // console.log('User:', user);

  useEffect(() => {
    if (router.isReady) {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (Object.keys(userData).length === 0) {
        // If user data is not found in localStorage
        router.push('/LoginPage');
      } else {
        {
          if (
            userData.role == 'Student' &&
            teacherAccess.includes(router.pathname)
          ) {
            router.push('/StudentDashboard');
          } else if (
            userData.role == 'Teacher' &&
            studentAccess.includes(router.pathname)
          ) {
            router.push('/TeacherDashboard');
          }
        }
      }
    }
  }, [router]);

  return <>{children}</>;
};

export default PrivateRouter;
