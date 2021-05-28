import * as adminController from './admin.controller';
import * as express from 'express';
import { jwtAuth } from '../middleware/jwtAuthenticate';
import setData from '../middleware/setData';
import setProfileAuth from '../middleware/setProfileAuth';

const router = express.Router();

router
    .get('/listUsers', jwtAuth, adminController.listUsers)
    .get('/userDetails', jwtAuth, adminController.userDetails)
    .post('/extractSkills',jwtAuth,  adminController.extractSkillsFromExcel)
    .post('/userStatus', jwtAuth,setData(),adminController.adminPanel)
    .post('/registeredUserList', jwtAuth, adminController.registeredUserList)
    .post('/addJobCategory', jwtAuth, adminController.addJobCategory)
    .post('/addSkills', jwtAuth, adminController.addSkills)
    .get('/allSkills',  jwtAuth,setData(), adminController.allSkills)

export default router;