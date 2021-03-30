import * as adminController from './admin.controller';
import * as express from 'express';
import { jwtAuth } from '../middleware/jwtAuthenticate';
import setData from '../middleware/setData';
import setProfileAuth from '../middleware/setProfileAuth';

const router = express.Router();

router
    .get('/listUsers', jwtAuth,setProfileAuth([1]), adminController.listUsers)
    .get('/userDetails', jwtAuth,setProfileAuth([1]), adminController.userDetails)
    .post('/extractSkills',jwtAuth,  adminController.extractSkillsFromExcel)
    .post('/userStatus', jwtAuth, setProfileAuth([1]),adminController.adminPanel)
    .post('/registeredUserList', jwtAuth,setProfileAuth([1]), adminController.registeredUserList)
    .post('/addJobCategory', jwtAuth, adminController.addJobCategory)
    .post('/addSkills', jwtAuth, adminController.addSkills)
    .get('/allSkills',  jwtAuth,setData(),setProfileAuth([1]), adminController.allSkills)

export default router;