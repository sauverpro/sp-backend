import express from "express";
import { isAdmin, verifyToken } from "../middleware";
import {
  RegisterProduct,
  deleteProduct,
  getAllProduct,
  getProductById,
  updateTotalPrice,
  updateProduct
} from "../controllers/products";
import upload from "../middleware/multer";
const productRouter = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *      bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 *   schemas:
 *      Products:
 *          type: object
 *          required:
 *              - Image
 *              - Kilograms
 *              - Type
 *          properties:
 *              Image:
 *                  type: string
 *                  description: Products Name
 *              Kilograms:
 *                  type: string
 *                  description: Tariff Name
 *              Type:
 *                  type: string
 *                  description: Tariff Type details
 *
 *          example:
 *             Image: "image.jpg"
 *             Kilograms: 6
 *             Type: "Double Acting Cylinder"
 *
 */

/**
 * @swagger
 * tags:
 *  name: PRODUCTS
 *  description: The Product managing API's
 */

/**
 * @swagger
 * /api/v1/product/register:
 *  post:
 *    summary: -REGISTER Product
 *    tags: [PRODUCTS]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *             type: object
 *             properties:
 *               Image:
 *                type: file
 *                items:
 *                    type: string
 *                    format: binary
 *               Kilograms:
 *                type: Number
 *               Type:
 *                type: string
 *    responses:
 *      200:
 *        description: Product registered successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Products'
 *      500:
 *        description: internal server error
 *
 */
productRouter.post("/register", verifyToken, isAdmin, upload, RegisterProduct);

/**
 * @swagger
 * /api/v1/product:
 *  get:
 *    summary: Returns all registered Products
 *    tags: [PRODUCTS]
 *    responses:
 *        200:
 *          description: The list of all Products
 *          content:
 *              application/json:
 *                  schema:
 *                     schema:
 *                         type: array
 *                         items:
 *                          $ref: '#/components/schemas/Products'
 */

productRouter.get("/", getAllProduct);
/**
 * @swagger
 * /api/v1/product/{productId}:
 *  get:
 *    summary: -Returns single Admin details
 *    tags: [PRODUCTS]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *        - in: path
 *          name: productId
 *          required: true
 *          schema:
 *            type: string
 *            description: Id of Product to be retrieved
 *    responses:
 *        200:
 *          description: Product details
 *          content:
 *              application/json:
 *                  schema:
 *                     schema:
 *                         type: array
 *                         items:
 *                          $ref: '#/components/schemas/Products'
 *        404:
 *          description: Product doesn't found
 *        500:
 *          description: internal server error
 *
 */

productRouter.get("/:productId", verifyToken, getProductById);
/**
 * @swagger
 * /api/v1/product/update:
 *  put:
 *    tags: [PRODUCTS]
 *    summary: Update total price for product
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              UnitPrice:
 *                type: Number
 *    responses:
 *      200:
 *        description: Product update successfully
 *      500:
 *        description: Failed to update Product
 *
 */
productRouter.put("/update", verifyToken, isAdmin, updateTotalPrice);
/**
 * @swagger
 * /api/v1/product/delete/{productId}:
 *  delete:
 *    tags: [PRODUCTS]
 *    summary: Delete Admin by ID
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: productId
 *        required:  true
 *        schema:
 *         type: string
 *         description: Id of  products to be deleted
 *    responses:
 *      200:
 *        description: Products deleted successfully
 *      404:
 *        description: Failed to deleted Products
 *
 */


/**
 * @swagger
 * /api/v1/product/{id}:
 *  patch:
 *    tags: [PRODUCTS]
 *    summary: Update products
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
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
 *              Kilograms:
 *                type: number
 *              Type:
 *                  type: string
 *    responses:
 *      200:
 *        description: product updated successfully
 *      500:
 *        description: Failed to update Product
 *
 */
productRouter.delete("/delete/:productId", verifyToken, isAdmin, deleteProduct);
productRouter.patch("/:id", verifyToken, upload, updateProduct)
export default productRouter;
