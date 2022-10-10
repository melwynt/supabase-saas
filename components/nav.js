import Link from 'next/link';
import { useUser } from '../context/user';

const Nav = () => {
  const { user, isLoading } = useUser();
  return (
    <nav>
      <Link href="/">
        <a>Home</a>
      </Link>
      <Link href="/pricing">
        <a>Pricing</a>
      </Link>
      {!isLoading && !!user && (
        <Link href="/dashboard">
          <a>Dashboard</a>
        </Link>
      )}
      {!isLoading && (
        <Link href={user ? '/logout' : '/login'}>
          <a>{user ? 'Logout' : 'Login'}</a>
        </Link>
      )}
    </nav>
  );
};

export default Nav;
