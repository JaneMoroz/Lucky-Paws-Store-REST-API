import axios from 'axios';

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
      console.log('You are logged in!');
      window.setTimeout(() => {
        location.assign('/my-account');
      }, 1500);
    }
  } catch (err) {
    console.log('Smth went wrong!');
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });

    if (res.data.status === 'success') location.assign('/');
  } catch (err) {
    console.log('You are logged out!');
  }
};
