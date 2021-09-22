import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import AppConfig from './config/config';
import router from './jobs.router';
import configurePassport from './config/passportJwtConfig';
import {swaggerSpec} from './swagger';
import * as swaggerUi from 'swagger-ui-express';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';



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



// Sentry.init({
//   dsn: 'https://04823e79eb4a4e6fb5eef08ac88a5309@o950107.ingest.sentry.io/5898778',
//   integrations: [
//     // enable HTTP calls tracing
//     new Sentry.Integrations.Http({tracing: true}),
//     // enable Express.js middleware tracing
//     new Tracing.Integrations.Express({app}),
//   ],

//   // Set tracesSampleRate to 1.0 to capture 100%
//   // of transactions for performance monitoring.
//   // We recommend adjusting this value in production
//   tracesSampleRate: 1.0,
// });

// // RequestHandler creates a separate execution context using domains, so that every
// // transaction/span/breadcrumb is attached to its own Hub instance
// app.use(Sentry.Handlers.requestHandler());
// // TracingHandler creates a trace for every incoming request
// app.use(Sentry.Handlers.tracingHandler());


// app.get('/debug-sentry', function mainHandler(req, res) {
//   throw new Error('My first Sentry error!');
// });

// app.use(Sentry.Handlers.errorHandler());

// // Optional fallthrough error handler
// app.use(function onError(err, req, res, next) {
//   // The error id is attached to `res.sentry` to be returned
//   // and optionally displayed to the user for support.
//   res.statusCode = 500;
//   res.end(res.sentry + '\n');
// });
app.listen(AppConfig.http.port, () => {
  console.log('Listening on port ' + AppConfig.http.port);
});