import initStripe from 'stripe';
import { getServiceSupabase } from '../../utils/supabase';

const handler = async (req, res) => {
  if (req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
    return res.status(401).send('You are not authorized to call this API');
  }

  const supabase = getServiceSupabase();

  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

  let customer;

  try {
    customer = await stripe.customers.create({
      email: req.body.record.email,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send(`Customer creation error: ${error.message}`);
  }

  console.log(`customer.id: ${customer.id}`);
  console.log(`req.body.record.id: ${req.body.record.id}`);

  await supabase
    .from('profile')
    .update({ stripe_customer: customer.id })
    .eq('id', req.body.record.id);

  res.send({ message: `stripe customer created: ${customer.id}` });
};

export default handler;
