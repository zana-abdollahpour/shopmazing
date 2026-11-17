import { Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise: Stripe | null;

const getStripe = async () => {
  const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;

  if (!stripePublicKey) {
    throw new Error("Stripe Public Key is required to initialize the app");
  }

  if (!stripePromise) {
    stripePromise = await loadStripe(stripePublicKey);
  }

  return stripePromise;
};

export default getStripe;
