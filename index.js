const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
import mongoose from "mongoose";
import mainRouter from "./src/routes";
require("dotenv").config();
// swagger imports
import swaggerJSDoc from "swagger-jsdoc";
import SwaggerUi from "swagger-ui-express";
// ...........................

const app = express();

app.use(bodyParser.json());
const port = process.env.PORT || 5000;
app.use(cors());
app.use("/api/v1", mainRouter);

// swagger doc configurations

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SP Rwanda ltd Api",
      version: "1.0.0",
      description:
        "SP Rwanda ltd, Here to provide gas purchase and delivery",
    },
    servers: [
      {
        url: "https://sp-gas-api.onrender.com/",
      }, 
      {
        url: "http://localhost:4000",
      }, 
    ],
  },
  apis: ["./src/routes/*.js"],
};
const specs = swaggerJSDoc(options);
app.use("/api-docs", SwaggerUi.serve, SwaggerUi.setup(specs));
// mongoose connection
mongoose.connect(process.env.DB_CONNECT).then((res) => {
  console.log("database connected well");
});

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () =>
  console.log(`Example app listening on port http://localhost:${port}`)
);