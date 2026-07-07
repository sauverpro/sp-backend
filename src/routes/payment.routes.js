import express from "express";
import { callback, cashout, payment, transaction } from "../controllers/payments";

const paymentRoute = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *      bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 *   schemas:
 *      Payment:
 *       type: object
 *       properties:
 *         productId:
 *           type: string
 *         Full:
 *           type: number
 *         purchasePrice:
 *           type: number
 *         Empty:
 *           type: number
 */

/**
 * @swagger
 * tags:
 *  name: PAYMENTS
 *  description: The payment managing Api
 */


/**
 * @swagger
 * /api/v1/payment/pay:
 *  post:
 *    summary: -Request To Pay
 *    tags: [PAYMENTS]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 required: true
 *               PhoneNumber:
 *                 type: string
 *                 required: true
 *             required:
 *               - PhoneNumber
 *               - orderId
 *    responses:
 *       200:
 *         description: Payment is being processed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 *               error: Details about the error
 */

paymentRoute.post("/pay", payment);


/**
 * @swagger
 * /api/v1/payment/payout:
 *  post:
 *    summary: -Request Payout
 *    tags: [PAYMENTS]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               PhoneNumber:
 *                 type: string
 *                 required: true
 *               Amount:
 *                 type: number
 *                 required: true
 *             required:
 *               - PhoneNumber
 *               - Amount
 *    responses:
 *       200:
 *         description: Payment is being processed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 *               error: Details about the error
 */


paymentRoute.post("/payout", cashout);

/**
 * @swagger
 * /api/v1/payment/transaction:
 *  get:
 *    summary: -All transactions
 *    tags: [PAYMENTS]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *       200:
 *         description: Processed Payments
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 *               error: Details about the error
 */
paymentRoute.get("/transactions", transaction);
paymentRoute.post("/callback", callback);

export default paymentRoute;