import { supabase } from '../utils/supabase';
import { useUser } from '../context/user';
import axios from 'axios';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();

  const loadPortal = async () => {
    const { data } = await axios.get('/api/portal');
    router.push(data.url);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {!isLoading && (
        <>
          <p>
            {user?.is_subscribed
              ? `Subscribed: ${user.interval}`
              : 'Not subscribed'}
          </p>
          <button onClick={loadPortal}>Manage Subscription</button>
        </>
      )}
    </div>
  );
};

export const getServerSideProps = async ({ req }) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
      props: {},
    };
  }

  return {
    props: {},
  };
};

export default Dashboard;
