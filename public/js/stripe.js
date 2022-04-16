import axios from 'axios';

const stripe = Stripe(
  'pk_test_51KooxlKe4i014ciff50JhbP4SfRYU8h7M5aopsfuuuuojXhdA7xCqYOlE01M0qJqsvSUJeE8cNguOBRVKUEcLjqB008AKZPWOd'
);

export const payForOrder = async (cartId) => {
  try {
    const session = await axios(`/api/v1/order/checkout-session/${cartId}/`);

    // 2. Create checkout form + charge a credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
  }
};
