import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { addNewProduct, editProduct } from './product';
import { addCartItem, deleteCartItem } from './cart';
import { payForOrder } from './stripe';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

/////////////////////////////////////////////////////////////////////
// Dom elements
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.account__nav-el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const addNewProductForm = document.querySelector('.form--add-product');
const editProductForm = document.querySelector('.form--edit-product');
const cart = document.querySelector('.cart');
const pdp = document.querySelector('.pdp');

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
    data.color = color.length === 0 || color[0] === '' ? [] : color;

    const style = document.getElementById('styles').value.split(', ');
    data.style = style.length === 0 || style[0] === '' ? [] : style;

    await addNewProduct(data);
  });
}

// Edit Product
if (editProductForm) {
  editProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--edit-product').textContent = 'Editing...';
    const productId =
      document.querySelector('.btn--edit-product').dataset.productid;

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
    data.color = color.length === 0 || color[0] === '' ? [] : color;

    const style = document.getElementById('styles').value.split(', ');
    data.style = style.length === 0 || style[0] === '' ? [] : style;

    await editProduct(productId, data);
  });
}

/////////////////////////////////////////////////////////////////////
// Cart
if (cart) {
  // Delete an Item from the card
  const cartId = cart.dataset.cartid;
  const deleteCartItemBtns = document.querySelectorAll(
    '.cart__details-btns--delete'
  );
  deleteCartItemBtns.forEach((btn) =>
    btn.addEventListener('click', async (e) => {
      const cartItemId = btn.dataset.cartitemid;

      await deleteCartItem(cartId, cartItemId);
    })
  );

  // Stripe/Checkout Session
  const addressForm = cart.querySelector('.form--address');
  addressForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    payForOrder(cartId);
  });
}

/////////////////////////////////////////////////////////////////////
// Product
// Add to cart
if (pdp) {
  const addToCartBtn = pdp.querySelector('.pdp__btns-add-to-cart ');
  addToCartBtn.addEventListener('click', async (e) => {
    const cartItem = {};
    cartItem.product = pdp.dataset.productid;
    cartItem.quantity = 1;
    cartItem.purchasePrice = +pdp
      .querySelector('.pdp__prices--current')
      .innerText.substring(1);

    await addCartItem(cartItem);
  });
}
