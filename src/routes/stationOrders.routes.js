import express from 'express';
import { isAdmin, isManager, isManagerOrAdmin, verifyToken } from "../middleware";
import { newStOrder,getstOrders,getOneStOrder, updateStOrder, deleteStOrder, updateStComplet,updateStCt } from '../controllers/stations/stationOrders.controller';



/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     stationOrders:
 *       type: object
 *       required:
 *         - Quantity
 *       properties:
 *         id:
 *           type: string
 *           description: auto generated id
 *         StationId:
 *           type: string
 *           description: Station delails
 *         ProductId:
 *           type: string
 *           description: product details
 *         Quantity:
 *           type: number
 *           description: Quantity details
 *         Status:
 *           type: string
 *           description: current status
 */

/**
 * @swagger
 * /api/v1/stOrder/addStOrder:
 *  post:
 *    summary: -Register Station Orders
 *    tags: [ST-ORDERS]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *             type: object
 *             properties:
 *               StationId:
 *                type: string
 *               ProductId:
 *                type: string
 *               Quantity:
 *                type: number
 *               Status:
 *                type: string
 *    responses:
 *      200:
 *        description: Station Order registered successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/stationOrders'
 *      500:
 *        description: internal server error
 */

/**
 * @swagger
 * /api/v1/stOrder/getStOrder:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    tags: [ST-ORDERS]
 *    summary: -Get all station orders
 *    responses:
 *      200:
 *        description: List All station orders
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/stationOrders'
 *      500:
 *        description: internal server error
 *
 */


/**
 * @swagger
 * /api/v1/stOrder/{id}:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required:  true
 *        schema:
 *         type: string
 *        description: Id of one station order
 *    tags: [ST-ORDERS]
 *    summary: -Get one station order
 *    responses:
 *      200:
 *        description: one station order
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/stationOrders'
 *      500:
 *        description: internal server error
 *
 */


/**
 * @swagger
 * /api/v1/stOrder/{id}:
 *  patch:
 *    tags: [ST-ORDERS]
 *    summary: Update station quantity order
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required:  true
 *        schema:
 *         type: string
 *        description: Id of a station order to be updated
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *             type: object
 *             properties:
 *               Quantity:
 *                type: string
 *    responses:
 *      200:
 *        description: external order updated successfully
 *      500:
 *        description: Failed to update Product
 *
 */

/**
 * @swagger
 * /api/v1/stOrder/completeSt/{id}:
 *  patch:
 *    tags: [ST-ORDERS]
 *    summary: Update station status to complete (Admin role)
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required:  true
 *        schema:
 *         type: string
 *        description: Id of a station order to be updated
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *             type: object
 *             properties:
 *               stationId:
 *                type: string
 *               productId:
 *                type: string
 *               quantity:
 *                type: number
 *    responses:
 *      200:
 *        description: external order updated successfully
 *      500:
 *        description: Failed to update Product
 *
 */

/**
 * @swagger
 * /api/v1/stOrder/cancelledSt/{id}:
 *  patch:
 *    tags: [ST-ORDERS]
 *    summary: Update station status to cancelled (Admin role)
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required:  true
 *        schema:
 *         type: string
 *        description: Id of a station order to be updated
 *    responses:
 *      200:
 *        description: external order updated successfully
 *      500:
 *        description: Failed to update Product
 *
 */

/**
 * @swagger
 * /api/v1/stOrder/{id}:
 *  delete:
 *    tags: [ST-ORDERS]
 *    summary: Delete A Station Order
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required:  true
 *        schema:
 *         type: string
 *         description: Id of a station order to be deleted
 *    responses:
 *      200:
 *        description: order deleted successfully
 *      404:
 *        description: Failed to deleted Products
 *
 */


const stationOrderRouter = express.Router();

stationOrderRouter.post("/addStOrder", verifyToken,isManager, newStOrder);
stationOrderRouter.get("/getStOrder", verifyToken ,getstOrders);
stationOrderRouter.get("/:id", verifyToken, getOneStOrder);
stationOrderRouter.patch("/:id", verifyToken, isManagerOrAdmin,updateStOrder);
stationOrderRouter.patch("/completeSt/:id", verifyToken, isAdmin,updateStComplet);
stationOrderRouter.patch("/cancelledSt/:id", verifyToken, isAdmin,updateStCt);
stationOrderRouter.delete("/:id", verifyToken,isAdmin, deleteStOrder);

export default stationOrderRouter;
