import { useEffect } from 'react';
import { useUser } from '../context/user';

const Login = () => {
  const { login } = useUser();

  useEffect(() => {
    login();
  }, []);

  return (
    <div className="py-32 text-center">
      <h2 className="font-extrabold text-4xl">Logging in</h2>
    </div>
  );
};

export default Login;
