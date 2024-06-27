import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import privateRouter from '@/components/privateRouter';
import { ViewIcon, ViewOffIcon } from 'hugeicons-react';

const SignupPage: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordShow, setPasswordShow] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (
      !name.trim() ||
      !contactNumber.trim() ||
      !department.trim() ||
      !role.trim() ||
      !fatherName.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      setError('Please fill in all fields');
      return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Phone number validation
    const phonePattern = /^01[3-9]\d{8}$/;
    if (!phonePattern.test(contactNumber)) {
      setError(
        'Please enter a valid phone number (11 digits starting with 01)'
      );
      return;
    }

    // Password validation
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(password)) {
      setError(
        'Password must be at least 8 characters long and must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      );
      return;
    }

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        contactNumber,
        department,
        role,
        fatherName,
        email,
        password,
      }),
    });

    if (res.ok) {
      // Redirect to login page upon successful sign-up
      router.push('/LoginPage');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/3"
        onSubmit={handleSignup}
      >
        <h2 className="text-2xl mb-4 text-gray-700">Sign Up</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="contactNumber"
          >
            Contact Number
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            id="contactNumber"
            type="text"
            placeholder="Contact Number"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="department"
          >
            Department
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            id="department"
            type="text"
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="department"
          >
            Role
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            id="role"
            type="text"
            placeholder="Student or Teacher"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="fatherName"
          >
            Father's Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            id="fatherName"
            type="text"
            placeholder="Father's Name"
            value={fatherName}
            onChange={(e) => setFatherName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Email"
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 focus:outline-none focus:shadow-outline"
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
              {isPasswordShow ? <ViewOffIcon /> : <ViewIcon />}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign Up
          </button>
          <span className="ml-4 text-gray-700">
            Already have an account?{' '}
            <a href="/LoginPage" className="text-blue-500 hover:text-blue-700">
              Login
            </a>
          </span>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;
