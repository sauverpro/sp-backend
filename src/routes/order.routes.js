import express from "express";
import { isAdmin, isDriver, isManager, verifyToken } from "../middleware";
import {
  orders,
  readOrder,
  readOneOrder,
  orderDelete,
  updateDriverId,
  updateStationId,
  driverOrders,
  stationOrders,
  cancelOrders,
  isCompOrders,
  userOder
} from "../controllers/orders/order.controller";

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     customerOrders:
 *       type: object
 *       required:
 *         - TotalOrder
 *       properties:
 *         id:
 *           type: string
 *           description: auto generated id
 *         CartId:
 *           type: string
 *           description: Cart items
 *         address:
 *           type: string
 *           description: Cart items
 *         phoneNumber:
 *           type: string
 *           description: Cart items
 *         TotalOrder:
 *           type: number
 *           description: Total orders
 *         Status:
 *           type: string
 *           description: Status of the orders
 *         StationId:
 *           type: string
 *           description: populate station object
 *         DriverId:
 *           type: string
 *           description: populate Drivers
 */


/**
 * @swagger
 * /api/v1/order/addOrder:
 *  post:
 *    summary: -REGISTER Orders
 *    tags: [ORDERS]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *             type: object
 *             properties:
 *               CartId:
 *                type: string
 *               phoneNumber:
 *                type: string
 *                description: Cart items
 *               address:
 *                type: string
 *                description: Total orders
 *               TotalOrder:
 *                type: number
 *    responses:
 *      200:
 *        description: Order registered successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/customerOrders'
 *      500:
 *        description: internal server error
 */

/**
 * @swagger
  * /api/v1/order/userOrder/{userId}:
 *   get:
 *     summary: Get orders for a specific user
 *     tags: [ORDERS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID to filter orders
 *     responses:
 *       '200':
 *         description: A list of orders for the specified user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/customerOrders'
 *       '404':
 *         description: User not found or no orders for the user
 */

/**
 * @swagger
 * /api/v1/order/getOrder:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    tags: [ORDERS]
 *    summary: -Get all orders
 *    responses:
 *      200:
 *        description: List All product
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/customerOrders'
 *      500:
 *        description: internal server error
 *
 */

/**
 * @swagger
 * /api/v1/order/{id}:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required:  true
 *        schema:
 *         type: string
 *        description: Id of one order
 *    tags: [ORDERS]
 *    summary: -Get one order
 *    responses:
 *      200:
 *        description: one order
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/customerOrders'
 *      500:
 *        description: internal server error
 *
 */

/**
 * @swagger
 * /api/v1/order/updateDriver/{orderId}:
 *  put:
 *    tags: [ORDERS]
 *    summary: Update driver 
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: orderId
 *        required:  true
 *        schema:
 *         type: string
 *        description: Id of an order to be deleted
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *             type: object
 *             properties:
 *               DriverId:
 *                type: string
 *    responses:
 *      200:
 *        description: Station update successfully
 *      500:
 *        description: Failed to update Product
 *
 */

/**
 * @swagger
 * /api/v1/order/updateStation/{orderId}:
 *  put:
 *    tags: [ORDERS]
 *    summary: Update an Order 
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: orderId
 *        required:  true
 *        schema:
 *         type: string
 *         description: Id of an order to be deleted
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *             type: object
 *             properties:
 *               StationId:
 *                type: string
 *    responses:
 *      200:
 *        description: Updating an order
 *      500:
 *        description: failed to update an order
 *
 */

/**
 * @swagger
 * /api/v1/order/deleteOrder/{id}:
 *  delete:
 *    tags: [ORDERS]
 *    summary: Delete An Order
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required:  true
 *        schema:
 *         type: string
 *         description: Id of an order to be deleted
 *    responses:
 *      200:
 *        description: order deleted successfully
 *      404:
 *        description: Failed to deleted Products
 *
 */

/**
 * @swagger
 * /api/v1/order/by-station/{StationId}:
 *   get:
 *     summary: Get all customer orders with a specified Station ID
 *     tags: [ORDERS]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: StationId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the driver to retrieve orders for
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/customerOrders'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 *               error: Details about the error
 */


/**
 * @swagger
 * /api/v1/order/by-driver:
 *   get:
 *     summary: Get all customer orders with a specified Driver ID
 *     tags: [ORDERS]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/customerOrders'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 *               error: Details about the error
 */


const orderRouter = express.Router();

orderRouter.post("/addOrder", verifyToken, orders);
orderRouter.get("/getOrder", verifyToken, readOrder);
orderRouter.get('/userOrder/:userId', verifyToken, userOder);
orderRouter.get("/by-driver", verifyToken, isDriver, driverOrders);
orderRouter.get(
  "/by-station/:StationId",
  verifyToken,
  isManager,
  stationOrders
);
orderRouter.get("/:id", verifyToken, readOneOrder);
orderRouter.put(
  "/updateStation/:orderId",
  verifyToken,
  isAdmin,
  updateStationId
);
orderRouter.put(
  "/updateDriver/:orderId",
  verifyToken,
  isManager,
  updateDriverId
);
orderRouter.delete("/deleteOrder/:id", verifyToken, orderDelete);
orderRouter.patch("/orderCanc/:id", verifyToken, cancelOrders);
orderRouter.patch("/orderComp/:id", verifyToken, isCompOrders);

export default orderRouter;
