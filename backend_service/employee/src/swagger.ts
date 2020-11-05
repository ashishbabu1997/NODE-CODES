import * as swaggerJsDoc  from 'swagger-jsdoc';
import * as express from 'express';
import AppConfig from './config/config';


const app = express();

const swaggerDefinition = {
  info: {
    title: 'Ellow.io Api documentation',
    version: '1.0.0',
    description: 'Endpoints to test employee routes',
  },
  host: `devemployee.ellow.io`,
  basePath: `/api/${AppConfig.version}/employee`,
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
    apis:[`./src/*.ts`]
  };
 export const swaggerSpec = swaggerJsDoc(options);
