import * as swaggerJsDoc from 'swagger-jsdoc';
import * as express from 'express';
import AppConfig from './config/config';

const app = express();

const swaggerDefinition = {
  info: {
    title: 'Ellow.io Api documentation',
    version: '1.0.0',
    description: 'Endpoints to test admin (ellow recuiter) routes',
  },
  basePath: `/api/${AppConfig.version}/admin`,
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      scheme: 'bearer',
      in: 'header',
    },
  },
};

const options = {
  swaggerDefinition,
  apis: [`./src/admins/*.ts`],
};
export const swaggerSpec = swaggerJsDoc(options);
