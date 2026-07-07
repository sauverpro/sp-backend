import express from "express"
import { isAdmin, verifyToken } from "../middleware";
import { AllAdminStock, addAdminStock, addEmpty, deleteAdminStock, getAdminStock } from "../controllers/Stock";

const adminStockRouter = express.Router();
/**
 * @swagger
 * tags:
 *   name: ADMIN-STOCK
 *   description: API for managing stock
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AdminStock:
 *       type: object
 *       properties:
 *         _id:
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
 * /api/v1/adminStock/addStock:
 *   post:
 *     summary: Create a new stock entry
 *     tags: [ADMIN-STOCK]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 required: true
 *               quantity:
 *                 type: number
 *                 required: true
 *               purchasePrice:
 *                 type: number
 *                 required: true
 *             required:
 *               - productId
 *               - quantity
 *               - purchasePrice
 *     responses:
 *       201:
 *         description: Stock entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminStock'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 *               error: Details about the error
 */

adminStockRouter.post('/addStock', verifyToken, isAdmin, addAdminStock)

/**
 * @swagger
 * /api/v1/adminStock/empty:
 *   post:
 *     summary: Record empty value for a product in stock
 *     tags: [ADMIN-STOCK]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 required: true
 *               emptyValue:
 *                 type: number
 *                 required: true
 *             required:
 *               - productId
 *               - emptyValue
 *     responses:
 *       200:
 *         description: Empty value recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminStock'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 *               error: Details about the error
 */
adminStockRouter.post('/empty', verifyToken, isAdmin, addEmpty)


/**
 * @swagger
 * /api/v1/adminStock/:
 *   get:
 *     summary: Get all stock entries
 *     tags: [ADMIN-STOCK]
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
 *                 $ref: '#/components/schemas/AdminStock'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 *               error: Details about the error
 */

adminStockRouter.get("/", verifyToken, isAdmin, AllAdminStock)

/**
 * @swagger
 * /api/v1/adminStock/{id}:
 *   get:
 *     summary: Get a specific stock entry by ID
 *     tags: [ADMIN-STOCK]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the stock entry to retrieve
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminStock'
 *       404:
 *         description: Stock entry not found
 *         content:
 *           application/json:
 *             example:
 *               message: Stock entry not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 *               error: Details about the error
 */
adminStockRouter.get("/:id", verifyToken, isAdmin, getAdminStock)

/**
 * @swagger
 * /api/v1/adminStock/delete/{stockId}:
 *  delete:
 *    tags: [ADMIN-STOCK]
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
adminStockRouter.delete("/delete/:stockId", verifyToken, isAdmin, deleteAdminStock);
export default adminStockRouter