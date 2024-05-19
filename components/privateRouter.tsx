import { useRouter } from 'next/router';
import { useEffect } from 'react';

const PrivateRouter = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/LoginPage');
    }
  }, [router]);

  return <>{children}</>;
};

export default PrivateRouter;
