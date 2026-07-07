import express from "express";
import { verifyToken } from "../middleware";
import { createDel, getDeliveries, getOneDelivery, updateDelivery, deleteDeliveryFee } from "../controllers/payments/deliveriesAm";

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     deliveries:
 *       type: object
 *       required:
 *         - Amount
 *       properties:
 *         Amount:
 *           type: number
 *           description: Amount for delivery
 */

/**
 * @swagger
 * /api/v1/deliveryfee/addDelFee:
 *  post:
 *    summary: -REGISTER Delivery fee
 *    tags: [DELIVERY]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *             type: object
 *             properties:
 *               Amount:
 *                type: number
 *    responses:
 *      200:
 *        description: Delivery fee
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/deliveries'
 *      500:
 *        description: internal server error
 */

/**
 * @swagger
 * /api/v1/deliveryfee/getAllDelFee:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    tags: [DELIVERY]
 *    summary: -Get all external delivery fee payment
 *    responses:
 *      200:
 *        description: List All delivery fee payment
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/deliveries'
 *      500:
 *        description: internal server error
 *
 */


/**
 * @swagger
 * /api/v1/deliveryfee/{id}:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required:  true
 *        schema:
 *         type: string
 *        description: Id of one delivery
 *    tags: [DELIVERY]
 *    summary: -Get one delivery fee
 *    responses:
 *      200:
 *        description: one delivery fee
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/deliveries'
 *      500:
 *        description: internal server error
 */

/**
 * @swagger
 * /api/v1/deliveryfee/{id}:
 *  patch:
 *    tags: [DELIVERY]
 *    summary: Update delivery fee
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required:  true
 *        schema:
 *         type: string
 *        description: delivery amount to be updated
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/deliveries'
 *    responses:
 *      200:
 *        description: amount to be updated
 *      500:
 *        description: Failed to update Product
 *
 */

/**
 * @swagger
 * /api/v1/deliveryfee/{id}:
 *  delete:
 *    tags: [DELIVERY]
 *    summary: Delete delivery fee
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required:  true
 *        schema:
 *         type: string
 *         description: delete the delivery fee
 *    responses:
 *      200:
 *        description: delivery fee deleted successfully
 *      404:
 *        description: Failed to delete the delivery fee
 *
 */



const deliveryfeeRouter = express.Router();

deliveryfeeRouter.post("/addDelFee", verifyToken, createDel);
deliveryfeeRouter.get("/getAllDelFee", verifyToken, getDeliveries);
deliveryfeeRouter.get('/:id', verifyToken, getOneDelivery);
deliveryfeeRouter.patch("/:id", verifyToken, updateDelivery);
deliveryfeeRouter.delete("/:id", verifyToken, deleteDeliveryFee);

export default deliveryfeeRouter;
