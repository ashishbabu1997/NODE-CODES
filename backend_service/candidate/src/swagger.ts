import * as swaggerJsDoc from 'swagger-jsdoc';
import AppConfig from './config/config';

const swaggerDefinition = {
  info: {
    title: 'Ellow.io Api documentation',
    version: '1.0.0',
    description: 'Endpoints to test the user candidates routes',
  },

  basePath: `/api/${AppConfig.version}/`,
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
  apis: [`./src/candidates/*.ts`, `./src/freelancer/*.ts`, `./src/filter/*.ts`, `./src/hiring/*.ts`],
};
export const swaggerSpec = swaggerJsDoc(options);
