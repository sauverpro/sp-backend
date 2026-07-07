import express from "express";
import { isAdmin, isBoth, isManager, verifyToken } from "../middleware";
import {
  addStationStock,
  allStock,
  deleteStock,
  getAllStockEntriesByStationId,
  getStockById,
} from "../controllers/Stock";
const stockRouter = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *      bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 *   schemas:
 *      Stocks:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         stationId:
 *           type: string
 *         productId:
 *           type: string
 *         Full:
 *           type: number
 *         purchasePrice:
 *           type: number
 *         Empty:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *  name: MANAGER STOCK
 *  description: The Stock managing API's
 */

/**
 * @swagger
 * /api/v1/stock/addStock:
 *  post:
 *    summary: -Record  stock
 *    tags: [MANAGER STOCK]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stationId:
 *                 type: string
 *                 required: true
 *               productId:
 *                 type: string
 *                 required: true
 *               quantity:
 *                 type: number
 *                 required: true
 *             required:
 *               - stationId
 *               - productId
 *               - quantity
 *    responses:
 *       200:
 *         description: Stock recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stocks'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 *               error: Details about the error
 */


stockRouter.post("/addStock", verifyToken, isAdmin, addStationStock);

/**
 * @swagger
 * /api/v1/stock:
 *  get:
 *    summary: Returns all registered Stocks
 *    tags: [MANAGER STOCK]
 *    security:
 *       - bearerAuth: []
 *    responses:
 *        200:
 *          description: The list of all Stocks
 *          content:
 *              application/json:
 *                  schema:
 *                     schema:
 *                         type: array
 *                         items:
 *                          $ref: '#/components/schemas/Stocks'
 */

stockRouter.get("/", verifyToken, allStock);

/**
 * @swagger
 * /api/v1/stock/{stockId}:
 *  get:
 *    summary: -Returns single Stock details
 *    tags: [MANAGER STOCK]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *        - in: path
 *          name: stockId
 *          required: true
 *          schema:
 *            type: string
 *            description: Id of Stock to be retrieved
 *    responses:
 *        200:
 *          description: Stock details
 *          content:
 *              application/json:
 *                  schema:
 *                     schema:
 *                         type: array
 *                         items:
 *                          $ref: '#/components/schemas/Stocks'
 *        404:
 *          description: Stock doesn't found
 *        500:
 *          description: internal server error
 *
 */

stockRouter.get("/:stockId", verifyToken, getStockById);

/**
 * @swagger
 * /api/v1/stock/station/{stationId}:
 *   get:
 *     summary: Get all stock entries for a specific station
 *     tags: [MANAGER STOCK]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: stationId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the station to retrieve stock entries for
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Stocks'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 *               error: Details about the error
 */


stockRouter.get('/station/:stationId',verifyToken, getAllStockEntriesByStationId ),

/**
 * @swagger
 * /api/v1/stock/delete/{stockId}:
 *  delete:
 *    tags: [MANAGER STOCK]
 *    summary: Delete Stock by ID
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: stockId
 *        required:  true
 *        schema:
 *         type: string
 *         description: Id of  stock to be deleted
 *    responses:
 *      200:
 *        description: Stock deleted successfully
 *      404:
 *        description: Failed to deleted stock
 *
 */
stockRouter.delete("/delete/:stockId", verifyToken, isAdmin, deleteStock);

export default stockRouter;
