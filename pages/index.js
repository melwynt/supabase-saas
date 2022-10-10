import styles from '../styles/Home.module.css';
import { supabase } from '../utils/supabase';
import Link from 'next/link';
import { useUser } from '../context/user';

export default function Home({ lessons }) {
  const { user } = useUser();
  console.log(user);
  return (
    <div className={styles.container}>
      {lessons.map((lesson) => (
        <Link key={lesson.id} href={`/${lesson.id}`}>
          <a>{lesson.title}</a>
        </Link>
      ))}
    </div>
  );
}

export const getStaticProps = async () => {
  const { data: lessons } = await supabase.from('lesson').select('*');

  return {
    props: {
      lessons,
    },
  };
};
