import express from "express";
import {
  RegisterStation,
  deleteStation,
  getAllStations,
  getStationById,
} from "../controllers/stations";
import { isAdmin, verifyToken } from "../middleware";
const stationRouter = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *      bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 *   schemas:
 *      Stations:
 *          type: object
 *          required:
 *              - StationName
 *              - Location
 *              - Manager
 *          properties:
 *              StationName:
 *                  type: string
 *                  description: Station Name
 *              Location:
 *                 type: string
 *                 description: Location of the Station
 *              Manager:
 *                  type: string
 *                  description: Station Manager details
 *
 *          example:
 *             StationName: Gishushu branch
 *             Location: Gishushu
 *             Manager: "87646790yu8765"
 *
 */

/**
 * @swagger
 * tags:
 *  name: STATIONS
 *  description: The Stations managing API's
 */

/**
 * @swagger
 * /api/v1/stations/register:
 *  post:
 *    summary: -REGISTER STATION
 *    tags: [STATIONS]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *             $ref: '#/components/schemas/Stations'
 *    responses:
 *      200:
 *        description: Station registered successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Stations'
 *      500:
 *        description: internal server error
 *
 */
stationRouter.post("/register", verifyToken, isAdmin, RegisterStation);

/**
 * @swagger
 * /api/v1/stations:
 *  get:
 *    summary: Returns all registered Stations
 *    tags: [STATIONS]
 *    security:
 *       - bearerAuth: []
 *    responses:
 *        200:
 *          description: The list of all stations
 *          content:
 *              application/json:
 *                  schema:
 *                     schema:
 *                         type: array
 *                         items:
 *                          $ref: '#/components/schemas/Stations'
 */

stationRouter.get("/", verifyToken, isAdmin, getAllStations);
/**
 * @swagger
 * /api/v1/stations/{stationId}:
 *  get:
 *    summary: -Returns single Admin details
 *    tags: [STATIONS]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *        - in: path
 *          name: stationId
 *          required: true
 *          schema: 
 *            type: string
 *            description: Id of station to be retrieved
 *    responses:
 *        200:
 *          description: station details
 *          content:
 *              application/json:
 *                  schema:
 *                     schema:
 *                         type: array
 *                         items:
 *                          $ref: '#/components/schemas/Stations'
 *        404:
 *          description: Station doesn't found 
 *        500:
 *          description: internal server error
 *       
 */

stationRouter.get("/:stationId", verifyToken, getStationById);
/**
 * @swagger
 * /api/v1/stations/delete/{stationId}:
 *  delete: 
 *    tags: [STATIONS]
 *    summary: Delete Admin by ID
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: stationId
 *        required:  true
 *        schema:
 *         type: string
 *         description: Id of  station to be deleted
 *    responses:
 *      200:
 *        description: Station deleted successfully
 *      404:
 *        description: Failed to deleted Admin
 * 
 */ 
stationRouter.delete("/delete/:stationId", verifyToken, isAdmin, deleteStation);
export default stationRouter;
