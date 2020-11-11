import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import AppConfig from './config/config';
import router from './jobs.router';
import configurePassport from './config/passportJwtConfig';
import {swaggerSpec} from './swagger';
import * as swaggerUi from 'swagger-ui-express';

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '150mb' }));
app.use(bodyParser.urlencoded({
  limit: '150mb',
  extended: true
}));
configurePassport();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/', router);

app.listen(AppConfig.http.port, () => {
  console.log('Listening on port ' + AppConfig.http.port);
});