/* eslint-disable linebreak-style */
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
import { swaggerSpec } from './swagger';
import * as swaggerUi from 'swagger-ui-express';
import * as fileUpload from 'express-fileupload';
import * as rfs from 'rotating-file-stream'; // version 2.x
import * as path from 'path'; // version 2.x
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import * as dotenv from 'dotenv';
import * as cron from 'node-cron';
import { consoleTestResultHandler } from 'tslint/lib/test';
import * as cronScheduler  from './cronScheduler/cronscheduler';
dotenv.config();

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

app.use(
  cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(compression());
app.use(helmet());
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :postData :status :res[content-length]', { stream: accessLogStream }));
app.use(fileUpload());

app.use(bodyParser.json({ limit: '150mb' }));
app.use(
  bodyParser.urlencoded({
    limit: '150mb',
    extended: true,
  }),
);
configurePassport();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/', router);
app.use(express.static(__dirname + '/public'));

Sentry.init({
  dsn: 'https://04823e79eb4a4e6fb5eef08ac88a5309@o950107.ingest.sentry.io/5898778',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],
  environment: process.env.ENVIRONMENT,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.get('/debug-sentry', function mainHandler(req, res) {
  throw new Error('My first Sentry error!');
});

app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = err.status || 500;
  res.end(res.sentry + '\n');
});

app.listen(AppConfig.http.port, () => {
  console.log('Listening on port ' + AppConfig.http.port);
});

// const jobs=function(){
//   console.log("Running");
// }
// schedule.scheduleJob( '*/5 * * * * *', jobs());
cron.schedule('58 14 * * *', ()=> {
  console.log('Running cron scheduler');
  cronScheduler.candidateReporterDetailRemainder
});

