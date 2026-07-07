import express from "express";
import { verifyToken } from "../middleware";
import { addCart, addCartAndOrder, addToCart, deleteCart, getAllCart, updateCart } from "../controllers/cart";

const cartRouter = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *      bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 *   schemas:
 *      Carts:
 *          type: object
 *          required:
 *              - productId
 *              - quantity
 *          properties:
 *              productId:
 *                 type: string
 *                 description: Tariff to be on cart
 *              quantity:
 *                 type: string
 *                 description: Quantity of the gases
 *
 *          example:
 *             productId: hggfd56dgh78
 *             quantity: 2
 *
 */

/**
 * @swagger
 * tags:
 *  name: CART
 *  description: The Cart Managing API's
 */

/**
 * @swagger
 * /api/v1/cart/addCart:
 *  post:
 *    summary: -Add Cart
 *    tags: [CART]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *             type: object
 *             properties:
 *               productId:
 *                type: string
 *               quantity:
 *                type: number
 *    responses:
 *      200:
 *        description: Cart Recorded successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Carts'
 *      500:
 *        description: internal server error
 *
 */
cartRouter.post("/addCart", verifyToken, addCart);

/**
 * @swagger
 * /api/v1/cart/addOrder:
 *  post:
 *    summary: -Add a new cart and corresponding order
 *    tags: [CART]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *             type: object
 *             properties:
 *               productId:
 *                type: string
 *               quantity:
 *                type: number
 *               addOns:
 *                type: array
 *                description: List of add-ons for the cart
 *                items:
 *                  type: object
 *                  properties:
 *                    addonId:
 *                      type: string
 *                      description: The ID of the add-on
 *                    Count:
 *                      type: number
 *                      description: The count of the add-on
 *               TotalAmount:
 *                type: string
 *               Location:
 *                type: string
 *               Telephone:
 *                type: string
 *               PhoneNumber:
 *                type: string
 *    responses:
 *      200:
 *        description: Cart and Order added successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Carts'
 *      403:
 *        description: Failed to record cart
 *      500:
 *        description: internal server error
 *
 */
cartRouter.post("/addOrder", verifyToken,addCartAndOrder);


/**
 * @swagger
 * /api/v1/cart/{cartId}/addons:
 *   put:
 *     summary: Add addons and update TotalAmount for a cart item
 *     tags: [CART]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the cart item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               addOns:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     addonId:
 *                       type: string
 *                     Count:
 *                       type: number
 *               TotalAmount:
 *                 type: number
 *             required:
 *               - addOns
 *               - TotalAmount
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Carts'
 *       404:
 *         description: Cart item not found
 *         content:
 *           application/json:
 *             example:
 *               message: Cart item not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 *               error: Details about the error
 */

cartRouter.put('/:cartId/addons',verifyToken, addToCart);

// 250723682275  0724653667 0791774698 0771494930  0724653494 
/**
 * @swagger
 * /api/v1/cart:
 *  get:
 *    summary: Returns all Users Cart Items
 *    tags: [CART]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *        200:
 *          description: The list of Users Cart Items
 *          content:
 *              application/json:
 *                  schema:
 *                     schema:
 *                         type: array
 *                         items:
 *                          $ref: '#/components/schemas/Carts'
 */

cartRouter.get("/",verifyToken, getAllCart);

/**
 * @swagger
 * /api/v1/cart/update:
 *  patch:
 *    tags: [CART]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *             type: object
 *             properties:
 *               productId:
 *                type: string
 *               quantity:
 *                type: string
 *    
 *    responses:
 *      200:
 *        description: Cart Updated successfully
 *      404:
 *        description: Failed to update Cart
 *
 */
cartRouter.patch("/update", verifyToken, updateCart);
/**
 * @swagger
 * /api/v1/cart/delete/{productId}:
 *  delete:
 *    tags: [CART]
 *    security:
 *      - bearerAuth: []
 *    summary: Delete User cart item by ID
 *    parameters:
 *      - in: path
 *        name: productId
 *        required:  true
 *        schema:
 *         type: string
 *         description: Id of cart's Tariff to be deleted
 *    responses:
 *      200:
 *        description: Cart deleted successfully
 *      404:
 *        description: Failed to deleted Admin
 *
 */
cartRouter.delete("/delete/:productId", verifyToken, deleteCart);
export default cartRouter;
