import axios from 'axios';

// Login
export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
        withCredentials: true,
      },
    });

    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/my-account');
      }, 1500);
    }
  } catch (err) {
    console.log('Smth went wrong!');
  }
};

// Logout
export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });

    if (res.data.status === 'success') location.assign('/');
  } catch (err) {
    console.log('Smth went wrong!');
  }
};
