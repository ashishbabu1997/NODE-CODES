import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import AppConfig from './config/config';
import router from './candidate.router';
import configurePassport from './config/passportJwtConfig';
import * as swaggerUi from 'swagger-ui-express';
import * as swaggerJsDoc  from 'swagger-jsdoc';


const app = express();

const swaggerDefinition = {
  info: {
    title: 'Ellow.io Api documentation',
    version: '1.0.0',
    description: 'Endpoints to test the user candidates routes',
  },
  host: `dev.ellow.io`,
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
let r = `./src/candidates/*.ts`;
const options = {
  swaggerDefinition,
  apis:[r]
};
const swaggerSpec = swaggerJsDoc(options);
// app.get('/swagger.json', function(req, res) {
//   res.setHeader('Content-Type', 'application/json');
//   res.send(swaggerSpec);
// });
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());
app.use(bodyParser.json({ limit: '150mb' }));
app.use(bodyParser.urlencoded({
  limit: '150mb',
  extended: true
}));
configurePassport();

app.use('/', router);

app.listen(AppConfig.http.port, () => {
  console.log('Listening on port ' + AppConfig.http.port);
});