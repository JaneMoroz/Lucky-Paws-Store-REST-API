const catchAsync = require('./../utils/catchAsync');
const Cart = require('./../models/cartModel');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

// Update cart
exports.updateCart = catchAsync(async (req, res, next) => {
  // Get Cart Item
  let cartItems = [...req.body];

  // Find user's cart and replace cartItems, if doesnt exist => create new cart
  const userCart = await Cart.findOne({ user: req.user.id, ordered: false });
  let updatedCart = {};

  if (!userCart) {
    const cart = await Cart.create({
      user: req.user,
    });
    cartItems.forEach((cartItem) => {
      cart.products.push(cartItem);
      cart.updated = Date.now();
    });
    updatedCart = await cart.save();
  } else {
    userCart.products = [];
    cartItems.forEach((cartItem) => {
      userCart.products.push(cartItem);
      userCart.updated = Date.now();
    });
    updatedCart = await userCart.save();
  }

  res.status(201).json({
    status: 'success',
    data: {
      data: updatedCart,
    },
  });
});

// Add item to the cart
exports.addCartItem = catchAsync(async (req, res, next) => {
  // Get Cart Item
  let cartItem = { ...req.body };

  // Find user's cart and add item to products, if doesnt exist => create new cart
  const userCart = await Cart.findOne({ user: req.user.id, ordered: false });

  if (!userCart) {
    const cart = await Cart.create({
      products: [cartItem],
      user: req.user,
    });
    res.status(201).json({
      status: 'success',
      data: {
        data: cart,
      },
    });
  } else {
    // Try to find product with same id and color/style in the cart
    const product = userCart.products.find(
      (el) =>
        String(el.product.id) === String(req.body.product) &&
        el.style === cartItem.style &&
        el.color === cartItem.color
    );

    // If such product exists increase quantity
    if (product) {
      product.quantity += cartItem.quantity;
      const updatedCart = await userCart.save();
      res.status(201).json({
        status: 'success',
        data: {
          data: updatedCart,
        },
      });
      // If not, create new cart item
    } else {
      userCart.products.push(cartItem);
      userCart.updated = Date.now();

      const updatedCart = await userCart.save();
      res.status(201).json({
        status: 'success',
        data: {
          data: updatedCart,
        },
      });
    }
  }
});

// Get all carts
exports.getCarts = factory.getAll(Cart);

// Get cart
exports.getCart = factory.getOne(Cart);

// Delete all items in the Cart
exports.deleteCart = factory.deleteOne(Cart);

// Update Cart Item
exports.updateCartItem = catchAsync(async (req, res, next) => {
  const userCart = await Cart.findById(req.params.id);

  if (!userCart) {
    return next(new AppError('No cart found with that ID', 404));
  }

  const { quantity, style, color } = req.body;

  const product = userCart.products.find(
    (el) => el.id === req.params.cartItemId
  );

  if (quantity !== undefined) {
    if (quantity !== 0) {
      product.quantity = quantity;
    } else {
      // Delete cart item if quantity === 0
      const itemIndex = userCart.products.findIndex(
        (el) => el.id === req.params.cartItemId
      );

      if (itemIndex !== 0) {
        userCart.products = userCart.products.splice(itemIndex, 1);
      } else userCart.products.shift();
    }
  }

  if (product.style && style !== undefined) product.style = style;
  if (product.color && color !== undefined) product.color = color;

  const updatedCart = await userCart.save();
  res.status(200).json({
    status: 'success',
    data: {
      data: updatedCart,
    },
  });
});
