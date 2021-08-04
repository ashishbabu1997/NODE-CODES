/* eslint-disable max-len */
/* eslint-disable no-undef */
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as compression from 'compression';
import * as morgan from 'morgan';
import * as helmet from 'helmet';


import AppConfig from './config/config';
import router from './candidate.router';

import configurePassport from './config/passportJwtConfig';
import {swaggerSpec} from './swagger';
import * as swaggerUi from 'swagger-ui-express';
import * as fileUpload from 'express-fileupload';
import * as rfs from 'rotating-file-stream'; // version 2.x
import * as path from 'path'; // version 2.x

const app = express();
// rotate daily
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: path.join(__dirname, 'log'),
});

morgan.token('postData', (request) => {
  if (request.method == 'POST') return ' ' + JSON.stringify(request.body);
  else return ' ';
});

app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(compression());
app.use(helmet());
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :postData :status :res[content-length]', {stream: accessLogStream}));
app.use(fileUpload());

app.use(bodyParser.json({limit: '150mb'}));
app.use(bodyParser.urlencoded({
  limit: '150mb',
  extended: true,
}));
configurePassport();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/', router);
app.use(express.static(__dirname + '/public'));

app.listen(AppConfig.http.port, () => {
  console.log('Listening on port ' + AppConfig.http.port);
});
