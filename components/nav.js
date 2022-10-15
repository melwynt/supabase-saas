import { useState } from 'react';
import Link from 'next/link';
import { useUser } from '../context/user';

const Nav = () => {
  const { user, isLoading } = useUser();
  const [visibility, setVisibility] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setVisibility((current) => {
      return !current;
    });
  };

  return (
    <>
      <nav className="bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex space-x-4">
              {/* <!-- logo --> */}
              <div>
                <Link href="/">
                  <a className="flex items-center py-5 px-2 text-gray-700 hover:text-gray-900">
                    <svg
                      className="w-6 h-6 mr-1 text-blue-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                      />
                    </svg>
                    {/* <span className="font-bold"></span> */}
                  </a>
                </Link>
              </div>

              {/* <!-- primary nav --> */}
              <div className="hidden md:flex items-center space-x-1">
                <Link href="/">
                  <a className="py-5 px-3 text-gray-700 hover:text-gray-900">
                    Home
                  </a>
                </Link>
                <Link href="/pricing">
                  <a className="py-5 px-3 text-gray-700 hover:text-gray-900">
                    Pricing
                  </a>
                </Link>
                {!isLoading && user && (
                  <Link href="/dashboard">
                    <a className="py-5 px-3 text-gray-700 hover:text-gray-900">
                      Dashboard
                    </a>
                  </Link>
                )}
              </div>
            </div>

            {/* <!-- secondary nav --> */}
            <div className="hidden md:flex items-center space-x-1">
              {!isLoading && (
                <Link href={user ? '/logout' : '/login'}>
                  <a className="py-2 px-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 hover:text-yellow-800 rounded transition duration-300">
                    {user ? 'Logout' : 'Login'}
                  </a>
                </Link>
              )}
            </div>

            {/* <!-- mobile button goes here --> */}
            <div className="md:hidden flex items-center">
              <button
                className="focus:ring-2 focus:to-sky-500 focus:rounded-md"
                onClick={(e) => {
                  handleClick(e);
                }}
              >
                <svg
                  className="w-6 h-6 "
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* <!-- mobile menu --> */}
        <div
          className={`md:hidden ${
            visibility ? '' : 'hidden'
          } flex flex-col justify-center items-center`}
        >
          <Link href="/">
            <a className="block text-center w-36 py-2 px-4 text-sm hover:bg-gray-200">
              Home
            </a>
          </Link>
          <Link href="/pricing">
            <a className="block text-center w-36 py-2 px-4 text-sm hover:bg-gray-200">
              Pricing
            </a>
          </Link>
          {!isLoading && user && (
            <Link href="/dashboard">
              <a className="block text-center w-36 py-2 px-4 text-sm hover:bg-gray-200">
                Dashboard
              </a>
            </Link>
          )}
          {!isLoading && (
            <Link href={user ? '/logout' : '/login'}>
              <a className="block text-center w-36 py-2 px-4 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 hover:text-yellow-800 rounded transition duration-300">
                {user ? 'Logout' : 'Login'}
              </a>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Nav;
