import swaggerJSDoc from "swagger-jsdoc";
import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 8000;

const swaggerOption = { 
    definition : {
        openapi: "3.0.0",
        info: {
            title: "You-Care-API",
            version: "1.0.0A",
            description: "API Documentation for You-Care"
        },
        servers: [
            {
                url: `http://localhost:${PORT}`
            },
        ],
    },
    apis: [path.join(__dirname, "../controller/*.mjs")]
};

const SwaggerDocs = swaggerJSDoc(swaggerOption);
export default SwaggerDocs;