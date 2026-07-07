import { Cart } from "../models/cartModel";
import { Product } from "../models/productModel";
import { User } from "../models/userModel";

// POST items to the shopping cart

export const createCart = async (req, res) => {
  const { productId, count, color } = req.body;

  try {
    let user;
    const { userId } = req;
    console.log("User ID:", userId);

    // If userId is provided, find the user
    user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let cart;

    // If userId is provided, check user cart
    cart = await Cart.findOne({ orderBy: user._id });

    // If no cart or no userId, create a new guest cart
    if (!cart) {
      const newCart = new Cart({
        products: [
          {
            product: productId,
            count,
            color,
            price: product.price,
          },
        ],
        cartTotal: product.price * count,
        orderBy: user ? user._id : null, //null for guest cart
      });

      await newCart.save();

      // If userId exist add item in cart
      if (user) {
        user.cart = newCart._id;
        await user.save();
      }

      return res.status(200).json({ user, cart: newCart });
    }
    console.log("carts items", cart);
    // Update cart count
    const existingProduct = cart.products.find(
      (item) => item.product.equals(productId) && item.color === color
    );

    if (existingProduct) {
      // Update the count
      existingProduct.count += count;

      existingProduct.price += product.price * count;
    } else {
      // Add a new product to the cart
      cart.products.push({
        product: productId,
        count,
        color,
        price: product.price * count,
      });
    }
    //calculate total
    cart.cartTotal = cart.products.reduce(
      (total, item) => total + item.count * item.price,
      0
    );

    await cart.save();

    res.status(200).json({ user, cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Update the quantity of items in cart
export const updateCart = async (req, res) => {
  const { productId, count, color } = req.query;

  try {
    const { userId } = req;
    const user = await User.findById(userId);

    console.log("userId", userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const product = await Product.findById(productId);
    console.log(product);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const cart = await Cart.findOne({ orderBy: user._id });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found for the user" });
    }

    // Find the product in the cart
    const cartProduct = cart.products.find((item) =>
      item.product.equals(productId)
    );
    console.log(cartProduct);

    if (!cartProduct) {
      return res
        .status(404)
        .json({ error: "Product not found in the user's cart" });
    }

    // Update the count of the product in the cart
    cartProduct.count = count || 0; //To prevent null

    cartProduct.price = product.price * count; // Update price

    // ReCalculate total
    cart.cartTotal = cart.products.reduce(
      (total, item) => total + (item.count || 0) * (item.price || 0),
      0
    );

    await cart.save();

    res.status(200).json({ user, cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get user's car
export const getCart = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const cart = await Cart.findOne({ orderBy: user._id });

    if (!cart) {
      return res.status(200).json({ cart: { products: [], cartTotal: 0 } });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const removeItemFromCart = async (req, res) => {
  try {
    const { userId } = req;

    const { productId } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cart = await Cart.findOne({ orderBy: user._id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found for the user" });
    }

    const cartProduct = cart.products.find((item) =>
      item.product.equals(productId)
    );
    if (!cartProduct) {
      return res.status(404).json({ error: "Product not found in the cart" });
    }

    // Extract the removed product details
    const removedProduct = {
      id: cartProduct.product._id,
      name: cartProduct.product.name,
      color: cartProduct.color,
      price: cartProduct.product.price,
      count: cartProduct.count,
    };

    // Removing the product from the cart
    cart.products = cart.products.filter(
      (item) => !item.product.equals(productId)
    );

    // Recalculate the total cart price
    cart.cartTotal = cart.products.reduce(
      (total, item) => total + item.count * item.price,
      0
    );

    await cart.save();

    res.status(200).json({ removedProduct, cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
