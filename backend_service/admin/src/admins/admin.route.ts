import * as adminController from './admin.controller';
import * as express from 'express';
import { jwtAuth } from '../middleware/jwtAuthenticate';
const router = express.Router();

router
    .get('/listUsers', jwtAuth, adminController.listUsers)
    .get('/userDetails', jwtAuth, adminController.userDetails)
    .post('/userStatus', jwtAuth, adminController.adminPanel)
    .get('/registeredUserList', jwtAuth, adminController.registeredUserList)
    .post('/addJobCategory', jwtAuth, adminController.addJobCategory)
    .post('/addSkills', jwtAuth, adminController.addSkills)
export default router;