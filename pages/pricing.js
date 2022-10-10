import initStripe from 'stripe';
import { useUser } from '../context/user';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import Link from 'next/link';

const Pricing = ({ plans }) => {
  const { user, login, isLoading } = useUser();

  const showSubscribeButton = !!user && !user.is_subscribed;
  const showCreateAccountButton = !user;
  const showManageSubscriptionButton = !!user && user.is_subscribed;

  const processSubscription = async (planId) => {
    const { data } = await axios.get(`api/subscription/${planId}`);
    console.log('data from processSubscription:', data);

    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

    await stripe.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <div>
      {plans.map((plan) => (
        <div key={plan.id}>
          <h2>{plan.name}</h2>
          <p>
            ${plan.price / 100} / {plan.interval}
          </p>
          {!isLoading && (
            <div>
              {showSubscribeButton && (
                <button
                  onClick={() => {
                    processSubscription(plan.id);
                  }}
                >
                  Subscribe
                </button>
              )}
              {showCreateAccountButton && (
                <button onClick={login}>Create Account</button>
              )}
              {showManageSubscriptionButton && (
                <Link href="/dashboard">
                  <a>Manage Subscription</a>
                </Link>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export const getStaticProps = async () => {
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

  const { data: prices } = await stripe.prices.list();

  const plans = await Promise.all(
    prices.map(async (price) => {
      const product = await stripe.products.retrieve(price.product);
      return {
        id: price.id,
        name: product.name,
        price: price.unit_amount,
        interval: price.recurring.interval,
        currency: price.currency,
      };
    }),
  );

  const sortedPlans = plans.sort((a, b) => a.price - b.price);

  return {
    props: {
      plans: sortedPlans,
    },
  };
};

export default Pricing;
