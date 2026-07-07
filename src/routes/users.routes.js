import express from "express";
import uploads from "../middleware/multer.config";
import { isAdmin, isManagerOrAdmin, verifyToken } from "../middleware";
import { RegisterUser, deleteUser, getAllUsers, getUserById, loginUser, updateUserProfile, updateLocation, updateNum } from "../controllers/authentication";
const userRouter = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *      bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 *   schemas:
 *      Users:
 *          type: object
 *          properties:
 *              FullNames:
 *                  type: string
 *                  description: User's full name
 *              Email:
 *                 type: string
 *                 description: Email of the user
 *              PhoneNumber:
 *                  type: string
 *                  description: User's telephone number
 *              IdNumber:
 *                  type: string
 *                  description: User's Identity number
 *              Password:
 *                  type: string
 *                  description: User's password
 *              Role:
 *                  type: string
 *                  description: User's role
 *          example:
 *             FullNames: john doe
 *             Email: johndoe@gmail.com
 *             PhoneNumber: "+250788888888"
 *             IdNumber: "2001000888888889"
 *             Password: "123456"
 *             Role: "Customer"
 *
 */

/**
* @swagger
* /api/v1/users/register:
*  post:
*    summary: -REGISTER USER
*    tags: [AUTHENTICATION]
*    requestBody:
*      required: true
*      content:
*        application/json:
*          schema:
*            $ref: '#components/schemas/Users'
*    responses:
*      200:
*        description: You have successfully signed up
*        content:
*          application/json:
*            schema:
*              $ref: '#components/schemas/Users'
*      500:
*        description: internal server error
*
*/
userRouter.post("/register",RegisterUser)

/**
 * @swagger
 * /api/v1/users/login:
 *  post:
 *    summary: -USER LOGIN 
 *    tags: [AUTHENTICATION]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              PhoneNumber:
 *                type: string
 *              Password:
 *                type: string
 *    responses:
 *      200:
 *        description: You have successfully logged in
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#components/schemas/Users'
 *      500:
 *        description: internal server error
 *      
 */
userRouter.post("/login", loginUser)


/**
 * @swagger
 * /api/v1/users:
 *  get:
 *    summary: Returns all registered users
 *    tags: [AUTHENTICATION]
 *    security:
 *       - bearerAuth: []
 *    responses:
 *        200:
 *          description: The list of all users
 *          content:
 *              application/json:
 *                  schema:
 *                     schema:
 *                         type: array
 *                         items:
 *                          $ref: '#components/schemas/Users'
 */


userRouter.get("/",verifyToken,isManagerOrAdmin, getAllUsers);


/**
 * @swagger
 * /api/v1/users/{userId}:
 *  get:
 *    summary: -Returns single User details
 *    tags: [AUTHENTICATION]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *        - in: path
 *          name: userId
 *          required: true
 *          schema: 
 *            type: string
 *            description: Id of User to be retrieved
 *    responses:
 *        200:
 *          description: User details
 *          content:
 *              application/json:
 *                  schema:
 *                     schema:
 *                         type: array
 *                         items:
 *                          $ref: '#components/schemas/Users'
 *        404:
 *          description: User doesn't found 
 *        500:
 *          description: internal server error
 *       
 */

userRouter.get("/:userId",verifyToken, getUserById);
userRouter.post("/profile",verifyToken,isAdmin, uploads, updateUserProfile);

/**
 * @swagger
 * /api/v1/users/location:
 *  put:
 *    summary: Add new Address
 *    tags: [AUTHENTICATION]
 *    security:
 *       - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              Location:
 *                type: string
 *    responses:
 *        200:
 *          description: Updated data for customer
 *          content:
 *              application/json:
 *                  schema:
 *                     schema:
 *                         type: array
 *                         items:
 *                          $ref: '#components/schemas/Users'
 */


userRouter.put("/location",verifyToken, updateLocation);

/**
 * @swagger
 * /api/v1/users/addNum:
 *  put:
 *    summary: Add new customer phone number
 *    tags: [AUTHENTICATION]
 *    security:
 *       - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              PhoneNumber:
 *                type: string
 *    responses:
 *        200:
 *          description: Updated data for customer
 *          content:
 *              application/json:
 *                  schema:
 *                     schema:
 *                         type: array
 *                         items:
 *                          $ref: '#components/schemas/Users'
 */



userRouter.put("/addNum",verifyToken, updateNum);

// userRouter.get("/:userId", changeAdminPassword);

/**
 * @swagger
 * /api/v1/users/delete/{userId}:
 *  delete: 
 *    tags: [AUTHENTICATION]
 *    summary: Delete User by ID
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: userId
 *        required:  true
 *        schema:
 *         type: string
 *         description: Id of  User to be deleted
 *    responses:
 *      200:
 *        description: User deleted successfully
 *      404:
 *        description: Failed to deleted User
 * 
 */ 
userRouter.delete("/delete/:userId",verifyToken,isAdmin, deleteUser);
export default userRouter