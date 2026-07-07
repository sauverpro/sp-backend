import express from "express";
// import uploads from "../middleware/multer.config";
import { isAdmin, verifyToken } from "../middleware";
import { getAllManagers, registerManager, updateUserProfile } from "../controllers/authentication";
import uploads from "../middleware/multer.config";
const managerRouter = express.Router();

/**
 * @swagger
 * tags:
 *  name: MANAGERS
 *  description: The user managing API's
 */

/**
 * @swagger
 * /api/v1/auth/managers/register:
 *  post:
 *    summary: -REGISTER MANAGER
 *    tags: [MANAGERS]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              FullNames:
 *                type: string
 *              Email:
 *                type: string
 *              PhoneNumber:
 *                type: string
 *              IdNumber:
 *                type: string
 *    responses:
 *      200:
 *        description: Manager registered successfully 
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Users'
 *      500:
 *        description: internal server error
 *
 */

managerRouter.post("/register", verifyToken, isAdmin, registerManager);

/**
 * @swagger
 * /api/v1/auth/managers:
 *  get:
 *    summary: Returns all registered Managers
 *    tags: [MANAGERS]
 *    security:
 *       - bearerAuth: []
 *    responses:
 *        200:
 *          description: The list of all Managers
 *          content:
 *              application/json:
 *                  schema:
 *                     schema:
 *                         type: array
 *                         items:
 *                          $ref: '#/components/schemas/Users'
 */

managerRouter.get("/", verifyToken, isAdmin, getAllManagers);

/**
 * @swagger
 * /api/v1/auth/managers/profile:
 *  patch:
 *    summary: -Update MANAGER Profile
 *    tags: [MANAGERS]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              profile:
 *                type: file
 *                items:
 *                    type: string
 *                    format: binary
 *    responses:
 *      200:
 *        description: Profile Updated successfully 
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Users'
 *      500:
 *        description: internal server error
 *
 */


managerRouter.patch("/profile",verifyToken,isAdmin,uploads,updateUserProfile);

// managerRouter.get("/:managerId", changeAdminPassword);

export default managerRouter;
