import { supabase } from '../utils/supabase';
import Link from 'next/link';

export default function Home({ lessons }) {
  return (
    <div className="py-32 text-center">
      {lessons.map((lesson) => (
        <h2 className="font-extrabold text-4xl" key={lesson.id}>
          <Link key={lesson.id} href={`/${lesson.id}`}>
            <a>{lesson.title}</a>
          </Link>
        </h2>
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
