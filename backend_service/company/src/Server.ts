import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import AppConfig from './config/config';
import router from './company.router';

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '150mb' }));
app.use(bodyParser.urlencoded({
  limit: '150mb',
  extended: true
}));

app.use('/', router);

app.listen(AppConfig.http.port, () => {
  console.log('Listening on port ' + AppConfig.http.port);
});