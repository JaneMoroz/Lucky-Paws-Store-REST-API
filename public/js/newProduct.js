import axios from 'axios';

// Login
export const addNewProduct = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/products/',
      data,
    });

    if (res.data.status === 'success') {
      console.log('Product is created');
      window.setTimeout(() => {
        location.assign('/manage-products');
      }, 1500);
    }
  } catch (err) {
    console.log('Smth went wrong!');
  }
};
