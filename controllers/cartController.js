const catchAsync = require('./../utils/catchAsync');
const Cart = require('./../models/cartModel');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

// Add item to the cart
exports.addCartItem = catchAsync(async (req, res, next) => {
  // Get Cart Item
  let cartItem = { ...req.body };
  // Calculate Cart Item properties
  cartItem.totalPrice = cartItem.purchasePrice * cartItem.quantity;
  cartItem.totalTax = cartItem.totalPrice * 0.2;
  cartItem.priceWithTax = cartItem.totalPrice + cartItem.totalTax;

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

// Get all items in the Cart
exports.getCartItems = factory.getOne(Cart);

// Delete all items in the Cart
exports.deleteCartItems = factory.deleteOne(Cart);

// Update Cart Item
exports.updateCartItem = catchAsync(async (req, res, next) => {
  const userCart = await Cart.findById(req.params.id);

  if (!userCart) {
    return next(new AppError('No cart found with that ID', 404));
  }

  const quantity = req.body.quantity;
  const style = req.body.style;
  const color = req.body.color;

  const product = userCart.products.find(
    (el) => el.id === req.params.cartItemId
  );

  product.quantity = quantity !== undefined ? quantity : product.quantity;

  if (product.style)
    product.style = style !== undefined ? style : product.style;
  if (product.color)
    product.color = color !== undefined ? color : product.color;

  const updatedCart = await userCart.save();
  res.status(200).json({
    status: 'success',
    data: {
      data: updatedCart,
    },
  });
});

// Delete Cart Item
exports.deleteCartItem = catchAsync(async (req, res, next) => {
  const userCart = await Cart.findById(req.params.id);

  if (!userCart) {
    return next(new AppError('No cart found with that ID', 404));
  }

  const itemIndex = userCart.products.findIndex(
    (el) => el.id === req.params.cartItemId
  );

  userCart.products = userCart.products.splice(itemIndex, 1);

  await userCart.save();
  res.status(204).json({
    status: 'success',
    data: null,
  });
});