import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import AppConfig from './config/config';
import CompanyRouter from './company.route';

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '150mb' }));
app.use(bodyParser.urlencoded({
  limit: '150mb',
  extended: true
}));
new CompanyRouter(app);

app.listen(AppConfig.http.port, () => {
    console.log('Listening on port ' + AppConfig.http.port);
});