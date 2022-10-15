import { useEffect } from 'react';
import { useUser } from '../context/user';

const Logout = () => {
  const { logout } = useUser();

  useEffect(() => {
    logout();
  }, []);

  return (
    <div className="py-32 text-center">
      <h2 className="font-extrabold text-4xl">Logging out</h2>
    </div>
  );
};

export default Logout;
