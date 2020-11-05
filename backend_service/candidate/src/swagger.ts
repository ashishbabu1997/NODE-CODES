import * as swaggerJsDoc  from 'swagger-jsdoc';
import * as express from 'express';
import AppConfig from './config/config';


const app = express();

const swaggerDefinition = {
  info: {
    title: 'Ellow.io Api documentation',
    version: '1.0.0',
    description: 'Endpoints to test the user candidates routes',
  },
  
  basePath: `/api/${AppConfig.version}/candidates`,
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
    apis:[`./src/candidates/*.ts`]
  };
 export const swaggerSpec = swaggerJsDoc(options);
