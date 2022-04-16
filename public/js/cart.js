import axios from 'axios';

// Add cart item
export const addCartItem = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/cart/`,
      data,
    });

    if (res.data.status === 'success') {
      console.log('You added an item to your cart!');
    }
  } catch (err) {
    console.log('Smth went wrong!');
  }
};

// Delete cart item
export const deleteCartItem = async (cartId, cartItemId) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/cart/${cartId}/${cartItemId}`,
    });

    console.log('You deleted an item from your cart!');
    window.setTimeout(() => {
      location.assign('/cart');
    }, 1500);
  } catch (err) {
    console.log('Smth went wrong!');
  }
};
