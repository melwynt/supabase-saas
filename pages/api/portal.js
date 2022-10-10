import { supabase } from '../../utils/supabase';
import cookie from 'cookie';
import initStripe from 'stripe';

const handler = async (req, res) => {
  // we are first getting the user object from the cookie
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return res.status(401).send('Unauthorized');
  }

  // we then parse the cookie to get the access token
  const access_token = cookie.parse(req.headers.cookie)['sb-access-token'];

  // this ensures the token will be sent in all subsequent requests
  supabase.auth.setAuth(access_token);

  const {
    data: { stripe_customer },
  } = await supabase
    .from('profile')
    .select('stripe_customer')
    .eq('id', user.id)
    .single();

  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

  const session = await stripe.billingPortal.sessions.create({
    customer: stripe_customer,
    return_url: `${process.env.CLIENT_URL}/dashboard`,
  });

  res.send({
    url: session.url,
  });
};

export default handler;
