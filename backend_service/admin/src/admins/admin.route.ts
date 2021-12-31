import * as adminController from './admin.controller';
import * as express from 'express';
import { jwtAuth } from '../middleware/jwtAuthenticate';
import setData from '../middleware/setData';
import setProfileAuth from '../middleware/setProfileAuth';
import { checkJwt } from '../middleware/auth0Jwt';

const router = express.Router();

router
  .get('/listUsers', jwtAuth, adminController.listUsers)
  .get('/userDetails', jwtAuth, adminController.userDetails)
  .post('/extractSkills', jwtAuth, adminController.extractSkillsFromExcel)
  .post('/userStatus', jwtAuth, setData(), adminController.adminPanel)
  .post('/registeredUserList', jwtAuth, adminController.registeredUserList)
  .post('/addJobCategory', jwtAuth, adminController.addJobCategory)
  .post('/addSkills', jwtAuth, adminController.addSkills)

  .delete('/deleteJobCategory', jwtAuth, setData(), adminController.deleteJobCategory)
  .put('/updateJobCategoryName', jwtAuth, setData(), adminController.editJobCategory)
  .put('/removeSkillsFromJobCategory', jwtAuth, setData(), adminController.removeSkillsFromJobCategory)
  .put('/udpateSkillName', jwtAuth, setData(), adminController.editSkill)
  .delete('/deleteSkills', jwtAuth, setData(), adminController.removeSkills)

  .get('/allSkills', jwtAuth, setData(), adminController.allSkills)
  .get('/reports', adminController.reports)
  .delete('/deleteResource', jwtAuth,setData(), setProfileAuth([1,2,1000]), adminController.deleteResource);
export default router;

// Admin@ellow123
