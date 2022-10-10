import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
// import Video from 'react-player/youtube';
import { useUser } from '../context/user';

const LessonDetails = ({ lesson }) => {
  const [videoUrl, setVideoUrl] = useState();
  const { user, login, isLoading } = useUser();

  const getPremiumContent = async () => {
    try {
      const { data } = await supabase
        .from('premium_content')
        .select('video_url')
        .eq('id', lesson.id);

      if (data.length !== 0) {
        console.log('video url:', data[0]?.video_url);
        setVideoUrl(data[0]?.video_url);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    // only get premium content if user is logged in
    if (!!user && user.is_subscribed) {
      getPremiumContent();
    }
  }, [user]);

  return (
    <div>
      <h1>{lesson.title}</h1>
      <p>{lesson.description}</p>
      {/* {!!videoUrl && <Video url={videoUrl} width="100%" />} */}
    </div>
  );
};

export const getStaticPaths = async () => {
  const { data: lessons } = await supabase.from('lesson').select('id');

  const paths = lessons.map(({ id }) => ({
    params: {
      id: id.toString(),
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params: { id } }) => {
  const { data: lesson } = await supabase
    .from('lesson')
    .select('*')
    .eq('id', id) // same as .match({ id }) // same as .match({ id: id })
    .single();

  return {
    props: {
      lesson,
    },
  };
};

export default LessonDetails;
