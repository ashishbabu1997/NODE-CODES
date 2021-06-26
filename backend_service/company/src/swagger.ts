import * as swaggerJsDoc  from 'swagger-jsdoc';
import * as express from 'express';
import AppConfig from './config/config';


const app = express();

const swaggerDefinition = {
  info: {
    title: 'Ellow.io Api documentation',
    version: '1.0.0',
    description: 'Endpoints to test company routes, userCompanyId is required only in case of authenticated user is an admin/ellowRecruiter',
  },
  basePath: `/api/${AppConfig.version}/company`,
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
    apis:[`./src/employee/*.ts`,`./src/profile/*.ts`]
  };
 export const swaggerSpec = swaggerJsDoc(options);
