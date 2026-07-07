import  express from "express";
import { isDriver, verifyToken } from "../middleware";
import upload from "../middleware/multer";
import { saveImage } from "../controllers/driver/driver.controller";

const driverRouter = express.Router();


/**
 * @swagger
 * tags:
 *  name: DRIVERS
 *  description: The Product managing API's
 */


/**
 * @swagger
 * /api/v1/driver/order/complete:
 *  put:
 *    summary: -Complete Order
 *    tags: [DRIVERS]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *             type: object
 *             properties:
 *               orderId:
 *                type: string
 *               Image:
 *                type: file
 *                items:
 *                    type: string
 *                    format: binary
 *    responses:
 *      200:
 *        description: Product registered successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/customerOrders'
 *      500:
 *        description: internal server error
 *
 */
driverRouter.put("/complete", verifyToken, isDriver, upload, saveImage);

export default driverRouter