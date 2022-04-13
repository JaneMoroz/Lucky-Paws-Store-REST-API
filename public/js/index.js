import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { addNewProduct } from './newProduct';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

/////////////////////////////////////////////////////////////////////
// Dom elements
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.account__nav-el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const addNewProductForm = document.querySelector('.form--add-product');

/////////////////////////////////////////////////////////////////////
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

/////////////////////////////////////////////////////////////////////
// Change settings
if (userDataForm) {
  userDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-settings').textContent = 'Updating...';

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    await updateSettings(form, 'data');

    document.querySelector('.btn--save-settings').textContent = 'Save settings';
    location.reload();
  });
}

// Change password
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

/////////////////////////////////////////////////////////////////////
// Product/ Add New Product
if (addNewProductForm) {
  console.log('form is resdy');
  addNewProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--add-product').textContent = 'Adding...';

    const data = {};
    data.name = document.getElementById('productName').value;
    data.type = document.getElementById('type').value;
    data.animal = document.getElementById('animal').value;
    data.brand = document.getElementById('brand').value;
    data.price = +document.getElementById('price').value;
    data.countInStock = +document.getElementById('countInStock').value;
    data.features = [
      document.getElementById('feature1').value,
      document.getElementById('feature2').value,
      document.getElementById('feature3').value,
      document.getElementById('feature4').value,
    ].filter((el) => el !== '');
    data.primaryImage = document.getElementById('primaryImg').value;
    data.otherImages = [
      document.getElementById('otherImg1').value,
      document.getElementById('otherImg2').value,
      ,
      document.getElementById('otherImg3').value,
    ].filter((el) => el !== '');

    const color = document.getElementById('colors').value.split(', ');
    data.color = color.length === 0 ? [] : color;

    const style = document.getElementById('styles').value.split(', ');
    data.style = style.length === 0 ? [] : style;

    console.log(data);

    await addNewProduct(data);
  });
}
