// Create or update an item in the user's cart
export const addCart = async (req, res) => {
    try {
      const { userId } = req;
      const { tariffId, quantity } = req.body;
  
      // Check if the user has an existing cart
      let userCart = await cartModel.findOne({ UserId: userId });
  
      if (!userCart) {
        // If the user doesn't have a cart, create a new one
        userCart = new cartModel({
          UserId: userId,
          products: [{ tariffId, quantity }],
        });
        await userCart.save();
        res.status(201).json(userCart);
      } else {
        // If the user has a cart, check if the product is already in the cart
        const existingProduct = userCart.products.find((product) =>
          product.tariffId.equals(tariffId)
        );
  
        if (existingProduct) {
          // If the product is already in the cart, update the quantity
          existingProduct.quantity += quantity;
        } else {
          // If the product is not in the cart, add it
          userCart.products.push({ tariffId, quantity });
        }
  
        await userCart.save();
        res.status(200).json(userCart);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };