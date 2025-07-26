import express from "express";
import connectMongoDB from "./src/Config/database.mjs";
import dotenv from "dotenv";
import KeycloakConnect from "keycloak-connect";
import cors from 'cors';
import SwaggerDocs from "./src/Config/swagger.mjs";
import swaggerUi from "swagger-ui-express";

import userRouter from "./src/controller/userController.mjs";
import donationRouter from "./src/controller/donationController.mjs";
import categoryRouter from "./src/controller/categoryController.mjs";
import needRouter from "./src/controller/needController.mjs";
import districtRouter from "./src/controller/districtController.mjs";


dotenv.config();
const app = express();
const keycloakConfig = {
    "confidential-port": 0,
    "realm": process.env.KEYCLOAK_REALM,
    "auth-server-url": process.env.KEYCLOAK_URL,
    "ssl-required": "external",
    "resource": process.env.KEYCLOAK_CLIENT,
    "bearer-only": true
}
const keycloak = new KeycloakConnect({},keycloakConfig);

//Middleware
app.use(keycloak.middleware());
app.use(express.json());
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(SwaggerDocs));

//Port
const PORT = process.env.PORT || 8000;

//Route
app.use("/api/user", keycloak.protect('realm:admin'), userRouter);
app.use("/api/donation", donationRouter);
app.use("/api/category", categoryRouter);
app.use("/api/need", needRouter);
app.use("/api/district", districtRouter);

//Ensure server and db connection
connectMongoDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Running on PORT ${PORT}`);
    })
})
.catch((err) => {
    console.log("Mongo DB Connection error : ", err);
})



