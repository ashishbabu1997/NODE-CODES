import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as compression  from 'compression';
import * as morgan  from 'morgan';
import * as helmet  from 'helmet';


import AppConfig from './config/config';
import router from './candidate.router';
import configurePassport from './config/passportJwtConfig';
import {swaggerSpec} from './swagger';
import * as swaggerUi from 'swagger-ui-express';

const app = express();

app.use(cors({
  methods: ["GET", "POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(compression());
app.use(helmet());
app.use(morgan('tiny'));


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