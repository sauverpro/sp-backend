import express from "express";
import { isAdmin, verifyToken } from "../middleware";
import {
  addTariff,
  deleteTariff,
  getAllTariff,
  getLatestTariff,
  getTariffById,
} from "../controllers/products";
import upload from "../middleware/multer";
const tariffRouter = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *      bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 *   schemas:
 *      Tariffs:
 *          type: object
 *          required:
 *              - Price
 *          properties:
 *              Price:
 *                  type: Number
 *                  description: Tariff Type details
 *          example:
 *             Image: 1500
 *
 */

/**
 * @swagger
 * tags:
 *  name: TARIFF
 *  description: The tariff managing API's
 */

/**
 * @swagger
 * /api/v1/tariff/add:
 *  post:
 *    summary: -Add new tariff
 *    tags: [TARIFF]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *             type: object
 *             properties:
 *               Price:
 *                type: Number
 *    responses:
 *      200:
 *        description: Tariff registered successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Tariffs'
 *      500:
 *        description: internal server error
 *
 */
tariffRouter.post("/add", verifyToken, isAdmin, upload, addTariff);

/**
 * @swagger
 * /api/v1/tariff/latest:
 *  get:
 *    summary: Returns Latest tariff
 *    tags: [TARIFF]
 *    responses:
 *        200:
 *          description: The list of latest Tariff
 *          content:
 *              application/json:
 *                  schema:
 *                     schema:
 *                         type: array
 *                         items:
 *                          $ref: '#/components/schemas/Tariffs'
 */

tariffRouter.get("/latest", getLatestTariff);

/**
 * @swagger
 * /api/v1/tariff:
 *  get:
 *    summary: Returns all tariff
 *    tags: [TARIFF]
 *    responses:
 *        200:
 *          description: The list of all Tariffs
 *          content:
 *              application/json:
 *                  schema:
 *                     schema:
 *                         type: array
 *                         items:
 *                          $ref: '#/components/schemas/Tariffs'
 */

tariffRouter.get("/", getAllTariff);
/**
 * @swagger
 * /api/v1/tariff/{tariffId}:
 *  get:
 *    summary: -Returns single tariff details
 *    tags: [TARIFF]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *        - in: path
 *          name: tariffId
 *          required: true
 *          schema:
 *            type: string
 *            description: Id of Product to be retrieved
 *    responses:
 *        200:
 *          description: Tariff details
 *          content:
 *              application/json:
 *                  schema:
 *                     schema:
 *                         type: array
 *                         items:
 *                          $ref: '#/components/schemas/Tariffs'
 *        404:
 *          description: Tariff doesn't found
 *        500:
 *          description: internal server error
 *
 */

tariffRouter.get("/:tariffId", verifyToken, getTariffById);
// /**
//  * @swagger
//  * /api/v1/product/update:
//  *  put:
//  *    tags: [PRODUCTS]
//  *    summary: Update total price for product
//  *    security:
//  *      - bearerAuth: []
//  *    requestBody:
//  *      required: true
//  *      content:
//  *        application/json:
//  *          schema:
//  *            type: object
//  *            properties:
//  *              UnitPrice:
//  *                type: Number
//  *    responses:
//  *      200:
//  *        description: Product update successfully
//  *      500:
//  *        description: Failed to update Product
//  *
//  */
// tariffRouter.put("/update", verifyToken, isAdmin, updateTotalPrice);

/**
 * @swagger
 * /api/v1/tariff/delete/{tariffId}:
 *  delete:
 *    tags: [TARIFF]
 *    summary: Delete tariff by ID
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: tariffId
 *        required:  true
 *        schema:
 *         type: string
 *         description: Id of  tariff to be deleted
 *    responses:
 *      200:
 *        description: Tariff deleted successfully
 *      404:
 *        description: Failed to delete Tariff
 *
 */
tariffRouter.delete("/delete/:tariffId", verifyToken, isAdmin, deleteTariff);
export default tariffRouter;
