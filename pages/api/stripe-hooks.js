import initStripe from 'stripe';
import { buffer } from 'micro';
import { getServiceSupabase } from '../../utils/supabase';

export const config = { api: { bodyParser: false } };

const handler = async (req, res) => {
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);
  const signature = req.headers['stripe-signature'];
  const signingSecret = process.env.STRIPE_SIGNING_SECRET;
  const reqBuffer = await buffer(req);

  let event;

  try {
    event = stripe.webhooks.constructEvent(reqBuffer, signature, signingSecret);
  } catch (error) {
    console.log(error);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  const supabase = getServiceSupabase();
  let dataUpdateProfile;

  switch (event.type) {
    case 'customer.subscription.updated':
      try {
        dataUpdateProfile = await supabase
          .from('profile')
          .update({
            is_subscribed: true,
            interval: event.data.object.plan.interval,
          })
          .eq('stripe_customer', event.data.object.customer);
        // note: .update('is_subscribed', true) would not work and not throw an error
      } catch (error) {
        console.log('error:', error);
      }
      break;
    case 'customer.subscription.deleted':
      try {
        dataUpdateProfile = await supabase
          .from('profile')
          .update({
            is_subscribed: false,
            interval: null,
          })
          .eq('stripe_customer', event.data.object.customer);
      } catch (error) {
        console.log('error:', error);
      }
      break;
  }

  res.send({ received: true });
};

export default handler;
