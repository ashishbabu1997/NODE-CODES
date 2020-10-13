import { listUsers, userDetails, adminPanel, registeredUserList } from './admin.controller';
import * as express from 'express';
import { jwtAuth } from '../middleware/jwtAuthenticate';
import setData from '../middleware/setData';
const router = express.Router();
router
    .get('/listUsers', jwtAuth, listUsers)
    .get('/userDetails', jwtAuth, userDetails)
    .post('/userStatus', jwtAuth, adminPanel)
    .get('/registeredUserList', jwtAuth, registeredUserList)
export default router;