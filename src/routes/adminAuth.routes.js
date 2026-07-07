// import express from "express";
// import {
//   RegisterAdmin,
//   changeAdminPassword,
//   deleteAdmin,
//   getAdminById,
//   getAllAdmins,
//   loginAdmin,
// } from "../controllers/authentication";
// import { isAdmin, verifyToken } from "../middleware";
// const adminRouter = express.Router();
// /**
//  * @swagger
//  * components:
//  *   securitySchemes:
//  *      bearerAuth:
//  *         type: http
//  *         scheme: bearer
//  *         bearerFormat: JWT
//  *   schemas:
//  *      Admin:
//  *          type: object
//  *          required:
//  *              - FullNames
//  *              - Email
//  *              - PhoneNumber
//  *              - Password
//  *          properties:
//  *              FullNames:
//  *                  type: string
//  *                  description: User's full name
//  *              Email:
//  *                 type: string
//  *                 description: Email of the user
//  *              PhoneNumber:
//  *                  type: string
//  *                  description: User's telephone number
//  *              Password:
//  *                  type: string
//  *                  description: User's password
//  *          example:
//  *             FullNames: john doe
//  *             Email: johndoe@gmail.com
//  *             PhoneNumber: "+250788888888"
//  *             Password: "12345"
//  *
//  */

// /**
//  * @swagger
//  * tags:
//  *  name: AUTHENTICATION
//  *  description: The user managing API's
//  */

// // /**
// //  * @swagger
// //  * /api/v1/admins/register:
// //  *  post:
// //  *    summary: -REGISTER
// //  *    tags: [AUTHENTICATION]
// //  *    requestBody:
// //  *      required: true
// //  *      content:
// //  *        application/json:
// //  *          schema:
// //  *            $ref: '#components/schemas/Admin'
// //  *    responses:
// //  *      200:
// //  *        description: You have successfully signed up
// //  *        content:
// //  *          application/json:
// //  *            schema:
// //  *              $ref: '#/components/schemas/Admin'
// //  *      500:
// //  *        description: internal server error
// //  *
// //  */
// adminRouter.post("/register", RegisterAdmin);

// /**
//  * @swagger
//  * /api/v1/admins/login:
//  *  post:
//  *    summary: -LOGIN
//  *    tags: [AUTHENTICATION]
//  *    requestBody:
//  *      required: true
//  *      content:
//  *        application/json:
//  *          schema:
//  *            type: object
//  *            properties:
//  *              Email:
//  *                type: string
//  *              Password:
//  *                type: string
//  *    responses:
//  *      200:
//  *        description: You have successfully logged in
//  *        content:
//  *          application/json:
//  *            schema:
//  *              $ref: '#/components/schemas/Admin'
//  *      500:
//  *        description: internal server error
//  *
//  */

// adminRouter.post("/login", loginAdmin);

// /**
//  * @swagger
//  * /api/v1/admins:
//  *  get:
//  *    summary: Returns all registered Admin
//  *    tags: [AUTHENTICATION]
//  *    security:
//  *       - bearerAuth: []
//  *    responses:
//  *        200:
//  *          description: the list of all Admin
//  *          content:
//  *              application/json:
//  *                  schema:
//  *                     schema:
//  *                         type: array
//  *                         items:
//  *                          $ref: '#/components/schemas/Admin'
//  */

// adminRouter.get("/",verifyToken,isAdmin, getAllAdmins);

// /**
//  * @swagger
//  * /api/v1/admins/{adminId}:
//  *  get:
//  *    summary: -Returns single Admin details
//  *    tags: [AUTHENTICATION]
//  *    security:
//  *      - bearerAuth: []
//  *    parameters:
//  *        - in: path
//  *          name: adminId
//  *          required: true
//  *          schema: 
//  *            type: string
//  *            description: Id of Admin to be retrieved
//  *    responses:
//  *        200:
//  *          description: User details
//  *          content:
//  *              application/json:
//  *                  schema:
//  *                     schema:
//  *                         type: array
//  *                         items:
//  *                          $ref: '#/components/schemas/Admin'
//  *        404:
//  *          description: Admin doesn't found 
//  *        500:
//  *          description: internal server error
//  *       
//  */

// adminRouter.get("/:adminId",verifyToken, getAdminById);
// adminRouter.get("/:adminId",verifyToken,isAdmin, changeAdminPassword);
// /**
//  * @swagger
//  * /api/v1/admins/delete/{adminId}:
//  *  delete: 
//  *    tags: [AUTHENTICATION]
//  *    summary: Delete Admin by ID
//  *    security:
//  *      - bearerAuth: []
//  *    parameters:
//  *      - in: path
//  *        name: adminId
//  *        required:  true
//  *        schema:
//  *         type: string
//  *         description: Id of  Admin to be deleted
//  *    responses:
//  *      200:
//  *        description: Admin deleted successfully
//  *      404:
//  *        description: Failed to deleted Admin
//  * 
//  */ 
// adminRouter.delete("/delete/:adminId",verifyToken,isAdmin, deleteAdmin);
// export default adminRouter;
