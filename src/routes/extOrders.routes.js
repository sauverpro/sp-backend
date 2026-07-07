import express from "express";
import { isAdmin, isManager, verifyToken } from "../middleware";
import {
  extOrder,
  getOrders,
  getOneExtOrder,
  updateExtOrder,
  deleteExtOrder,
  stationExternalOrders
} from "../controllers/orders/externalorders.controller.js";


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     externalOrders:
 *       type: object
 *       required:
 *         - Quantity
 *       properties:
 *         id:
 *           type: string
 *           description: auto generated id
 *         FullName:
 *           type: string
 *           description: Customer's full name
 *         PhoneNumber:
 *           type: string
 *           description: Customer's phone number
 *         ProductId:
 *           type: string
 *           description: product details
 *         Quantity:
 *           type: number
 *           description: Quantity details
 *         receiptNumber:
 *           type: string
 *           description: Receipt details
 *         PaymentMethod:
 *           type: string
 *           description: Payment Method details
 *         Amount:
 *           type: number
 *           description: Amount details
 */

/**
 * @swagger
 * /api/v1/extOrder/addExtOrder:
 *  post:
 *    summary: -REGISTER Orders
 *    tags: [EXTERNAL ORDERS]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *             type: object
 *             properties:
 *               FullName:
 *                type: string
 *               PhoneNumber:
 *                type: string
 *               StationId:
 *                type: string
 *               ProductId:
 *                type: string
 *               Quantity:
 *                type: number
 *               receiptNumber:
 *                type: string
 *               PaymentMethod:
 *                type: string
 *               Amount:
 *                type: number
 *    responses:
 *      200:
 *        description: External Order registered successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/externalOrders'
 *      500:
 *        description: internal server error
 */

/**
 * @swagger
 * /api/v1/extOrder/getExtOrder:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    tags: [EXTERNAL ORDERS]
 *    summary: -Get all external orders
 *    responses:
 *      200:
 *        description: List All external orders
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/externalOrders'
 *      500:
 *        description: internal server error
 *
 */


/**
 * @swagger
 * /api/v1/extOrder/{id}:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required:  true
 *        schema:
 *         type: string
 *        description: Id of one external order
 *    tags: [EXTERNAL ORDERS]
 *    summary: -Get one external order
 *    responses:
 *      200:
 *        description: one external order
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/externalOrders'
 *      500:
 *        description: internal server error
 *
 */


/**
 * @swagger
 * /api/v1/extOrder/station/{StationId}:
 *   get:
 *     summary: Get all customer orders with a specified Station ID
 *     tags: [EXTERNAL ORDERS]
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
 *                 $ref: '#/components/schemas/externalOrders'
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
 * /api/v1/extOrder/{id}:
 *  patch:
 *    tags: [EXTERNAL ORDERS]
 *    summary: Update external order
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required:  true
 *        schema:
 *         type: string
 *        description: Id of an external order to be updated
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/externalOrders'
 *    responses:
 *      200:
 *        description: external order updated successfully
 *      500:
 *        description: Failed to update Product
 *
 */

/**
 * @swagger
 * /api/v1/extOrder/{id}:
 *  delete:
 *    tags: [EXTERNAL ORDERS]
 *    summary: Delete An external Order
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required:  true
 *        schema:
 *         type: string
 *         description: Id of an external order to be deleted
 *    responses:
 *      200:
 *        description: order deleted successfully
 *      404:
 *        description: Failed to deleted Products
 *
 */


const extOrderRouter = express.Router();

extOrderRouter.post("/addExtOrder", verifyToken,isManager, extOrder);
extOrderRouter.get("/getExtOrder", verifyToken, getOrders);
extOrderRouter.get('/station/:StationId', verifyToken, stationExternalOrders);

extOrderRouter.get("/:id", verifyToken, getOneExtOrder);
extOrderRouter.patch("/:id", verifyToken, updateExtOrder);
extOrderRouter.delete("/:id", verifyToken, deleteExtOrder);

export default extOrderRouter;
