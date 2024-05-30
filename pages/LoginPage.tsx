import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import privateRouter from '@/components/privateRouter';
import useCurrentUser from '@/hooks/useCurrentUser';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordShow, setPasswordShow] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Client-side validation
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      // Redirect to student or teacher dashboard based on user's role
      const { email, role, name, id } = await res.json();
      localStorage.setItem('user', JSON.stringify({ email, role, name, id }));
      if (role.toLowerCase() === 'student') {
        router.push('/StudentDashboard');
      } else if (role.toLowerCase() === 'teacher') {
        router.push('/TeacherDashboard');
      }
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/3"
        onSubmit={handleLogin}
      >
        <h2 className="text-2xl mb-4">Log In</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="johndoe@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <div className="flex">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type={isPasswordShow ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="text-gray-700 ml-2"
              onClick={() => setPasswordShow(!isPasswordShow)}
            >
              Show
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign In
          </button>
          <a href="/SignupPage" className="text-blue-500 hover:text-blue-700">
            Sign Up
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
