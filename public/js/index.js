import { login, logout } from './login';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Dom elements
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.account__nav-el--logout');

// Login
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

// Log out
if (logOutBtn) logOutBtn.addEventListener('click', logout);
