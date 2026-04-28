const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Volunteer Connect API",
      version: "2.0.0",
      description: "Production-ready API for the NGO and Volunteer Collaboration Platform."
    },
    servers: [{ url: "http://localhost:5000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  apis: []
};

module.exports = swaggerJsdoc(options);
