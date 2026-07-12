import { cartModel } from "../../models";
import { customerOrderModel } from "../../models/customer.order.model";

const PaypackJs = require("paypack-js").default;
const paypackClientId = process.env.CLIENT_ID || process.env.PAYPACK_CLIENT_ID;
const paypackClientSecret =
  process.env.CLIENT_SECRETE ||
  process.env.CLIENT_SECRET ||
  process.env.PAYPACK_CLIENT_SECRET;

const paypack =
  paypackClientId && paypackClientSecret
    ? PaypackJs.config({
        client_id: paypackClientId,
        client_secret: paypackClientSecret,
      })
    : null;

// Create or update an item in the user's cart
export const addCartAndOrder = async (req, res) => {
  try {
    if (!paypack) {
      return res.status(503).json({
        message:
          "Payment service is not configured. Set CLIENT_ID/CLIENT_SECRETE or PAYPACK_CLIENT_ID/PAYPACK_CLIENT_SECRET.",
      });
    }

    const UserId = req.userId;
    // Extract data from the request body
    const {
      productId,
      addOns,
      quantity,
      TotalAmount,
      Location,
      Telephone,
      PhoneNumber,
    } = req.body;

    // Create a new cart item instance
    const newCartItem = new cartModel({
      UserId: UserId,
      products: [{ productId, quantity }],
      addOns: addOns,
      TotalAmount: TotalAmount,
      status: "checkout",
    });
    // Save the new cart item to the database
    const savedCartItem = await newCartItem.save();
    if (!savedCartItem) {
      return res.status(403).json({
        message: "Failed to record cart",
      });
    }
    await paypack
      .cashin({
        number: Telephone,
        amount: savedCartItem.TotalAmount,
        environment: "development",
      })
      .then(async (response) => {
        console.log(response.data);
        const newOrder = new customerOrderModel({
          CartId: savedCartItem._id,
          TotalOrder: savedCartItem.TotalAmount,
          address: Location,
          phoneNumber: PhoneNumber,
          ref: response.data.ref,
        });
        const order = await newOrder.save();
        res.status(201).json({
          status: "Success",
          message: "Cart And Order added successfully",
          order: order,
        });
        // res.status(201).json({ data: response.data });
      })
      .catch((err) => {
        console.log("error", err);
        return res.status(500).json({ message: err });
      });
  } catch (error) {
    console.error("Error adding cart item:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const addCart = async (req, res) => {
  try {
    const { userId } = req;
    const { productId, quantity } = req.body;

    // Check if the user has an existing cart
    let userCart = await cartModel.findOne({ UserId: userId });

    if (!userCart) {
      // If the user doesn't have a cart, create a new one
      userCart = new cartModel({
        UserId: userId,
        products: [{ productId, quantity }],
      });
      await userCart.save();
      res.status(201).json(userCart);
    } else {
      // If the user has a cart, check if the product is already in the cart
      const existingProduct = userCart.products.find((product) =>
        product.productId.equals(productId)
      );

      if (existingProduct) {
        // If the product is already in the cart, update the quantity
        existingProduct.quantity += quantity;
      } else {
        // If the product is not in the cart, add it
        userCart.products.push({ productId, quantity });
      }

      await userCart.save();
      res.status(200).json(userCart);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const cartItemId = req.params.cartId;

    // Find the cart item by ID
    const cartItem = await cartModel.findById(cartItemId);

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    cartItem.addOns = cartItem.addOns.concat(req.body.addOns);

    cartItem.TotalAmount = req.body.TotalAmount;

    // // Save the updated cart item
    const updatedCartItem = await cartItem.save();

    res.status(200).json(updatedCartItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all items in the user's cart
export const getAllCart = async (req, res) => {
  try {
    const { userId } = req;
    const userCart = await cartModel
      .find({ UserId: userId })
      .populate("UserId products.productId addOns.addonId");
    res.status(200).json(userCart ? userCart : []);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error.message });
  }
};

// Update quantity of an item in the user's cart
export const updateCart = async (req, res) => {
  try {
    const { userId } = req;
    const { quantity, productId } = req.body;

    const userCart = await cartModel.findOne({ UserId: userId });

    if (!userCart) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const existingProduct = userCart.products.find((product) =>
      product.productId.equals(productId)
    );

    if (!existingProduct) {
      res.status(404).json({ error: "Product not found in user's cart" });
      return;
    }

    existingProduct.quantity = quantity;
    await userCart.save();
    res.status(200).json(userCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an item from the user's cart
export const deleteCart = async (req, res) => {
  try {
    const { userId } = req;
    const { productId } = req.params;

    const userCart = await cartModel.findOne({ UserId: userId });

    if (!userCart) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const updatedProducts = userCart.products.filter(
      (product) => !product.productId.equals(productId)
    );
    userCart.products = updatedProducts;

    await userCart.save();
    res.status(200).json({
      message: "Item removed in cart",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
