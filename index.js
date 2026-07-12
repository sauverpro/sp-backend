const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
import dns from "node:dns";
import mongoose from "mongoose";
import mainRouter from "./src/routes";
require("dotenv").config();
// swagger imports
import swaggerJSDoc from "swagger-jsdoc";
import SwaggerUi from "swagger-ui-express";
// ...........................

const app = express();

app.use(bodyParser.json());
const port = process.env.PORT || 4000;
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

app.get("/", (req, res) => res.send("Hello World!"));

const connectMongo = async () => {
  const mongoUri = process.env.DB_CONNECT;
  const mongoDirectUri = process.env.DB_CONNECT_DIRECT;

  if (!mongoUri) {
    console.error("MongoDB connection failed: DB_CONNECT is not set in .env");
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("database connected well");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    const isSrvLookupIssue =
      error?.message?.includes("querySrv") ||
      error?.code === "ECONNREFUSED" ||
      error?.code === "ENOTFOUND";

    if (isSrvLookupIssue) {
      const dnsServers = (process.env.MONGO_DNS_SERVERS || "1.1.1.1,8.8.8.8")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      if (dnsServers.length > 0) {
        try {
          dns.setServers(dnsServers);
          await mongoose.connect(mongoUri);
          console.log("database connected well (DNS fallback)");
          return;
        } catch (dnsRetryError) {
          console.error(
            "MongoDB DNS fallback failed:",
            dnsRetryError.message
          );
        }
      }
    }

    if (isSrvLookupIssue && mongoDirectUri) {
      try {
        await mongoose.connect(mongoDirectUri);
        console.log("database connected well (direct URI fallback)");
        return;
      } catch (fallbackError) {
        console.error(
          "MongoDB direct URI fallback failed:",
          fallbackError.message
        );
      }
    }

    console.error(
      "Server is still running. Check DB_CONNECT/DB_CONNECT_DIRECT, network, DNS, and Atlas IP access list."
    );
  }
};

const startServer = async () => {
  app.listen(port, () =>
    console.log(`Example app listening on port http://localhost:${port}`)
  );

  await connectMongo();
};

startServer();