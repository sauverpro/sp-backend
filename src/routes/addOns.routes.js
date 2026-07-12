import express from "express"
import upload from "../middleware/multer";
import { isAdmin, verifyToken } from "../middleware";
import { addItem, getAddOnById, getAllAddOns, deletedAddOn, updateAddOn } from "../controllers/addOns";


const addOnRouter = express.Router()

/**
 * @swagger
 * tags:
 *   name: Add-ons
 *   description: API for managing add-ons
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AddOn:
 *       type: object
 *       required:
 *         - Name
 *         - Image
 *         - Price
 *         - productId
 *       properties:
 *         Name:
 *           type: string
 *         Image:
 *           type: string
 *         Price:
 *           type: number
 *         productId:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of product IDs
 */

/**
 * @swagger
 * /api/v1/addons/add:
 *   post:
 *     summary: Create a new add-on
 *     tags: [Add-ons]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *            type: object
 *            properties:
 *              Image:
 *                type: file
 *                items:
 *                    type: string
 *                    format: binary
 *              Name:
 *                type: string
 *              Price:
 *                type: number
 *              productId:
 *                  type: array
 *     responses:
 *       201:
 *         description: Add-on created successfully
 *       400:
 *         description: Bad request
 */

// Other CRUD endpoints should be similarly documented

addOnRouter.post('/add', verifyToken,upload, addItem)
/**
 * @swagger
 * /api/v1/addons/:
 *   get:
 *     summary: Get all add-ons with product details
 *     tags: [Add-ons]
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
 *                 $ref: '#/components/schemas/AddOn'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 *               error: Details about the error
 */

addOnRouter.get('/',verifyToken,getAllAddOns)
/**
 * @swagger
 * /api/v1/addons/{id}:
 *   get:
 *     summary: Get a specific add-on by ID
 *     tags: [Add-ons]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the add-on to retrieve
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddOn'
 *       404:
 *         description: Add-on not found
 *         content:
 *           application/json:
 *             example:
 *               message: Add-on not found
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
 * /api/v1/addons/{id}:
 *  patch:
 *    tags: [Add-ons]
 *    summary: Update Addons
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required:  true
 *        schema:
 *         type: string
 *        description: Id of addons to be updated
 *    requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *            type: object
 *            properties:
 *              Image:
 *                type: file
 *                items:
 *                    type: string
 *                    format: binary
 *              Name:
 *                type: string
 *              Price:
 *                type: number
 *              productId:
 *                  type: array
 *    responses:
 *      200:
 *        description: external order updated successfully
 *      500:
 *        description: Failed to update Product
 *
 */

/**
 * @swagger
 * /api/v1/addons/{id}:
 *  delete:
 *    tags: [Add-ons]
 *    summary: Delete Addons
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
 *        description: oddon deleted successfully
 *      404:
 *        description: Failed to deleted addons
 *
 */


addOnRouter.get('/:id',verifyToken, getAddOnById)
addOnRouter.put('/:id',verifyToken, isAdmin)

addOnRouter.delete('/:id',verifyToken, deletedAddOn)
addOnRouter.patch('/:id', verifyToken, upload, updateAddOn)


export default addOnRouter;
