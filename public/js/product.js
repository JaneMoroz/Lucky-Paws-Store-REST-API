import axios from 'axios';

// Add new product
export const addNewProduct = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/products/',
      data,
    });

    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/manage-products');
      }, 1500);
    }
  } catch (err) {
    console.log('Smth went wrong!');
  }
};

// Edit product
export const editProduct = async (productId, data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/products/${productId}`,
      data,
    });

    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/manage-products');
      }, 1500);
    }
  } catch (err) {
    console.log('Smth went wrong!');
  }
};
