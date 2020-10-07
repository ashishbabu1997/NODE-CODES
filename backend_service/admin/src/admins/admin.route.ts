import { listUsers,userDetails,adminPanel,positionDeletion } from './admin.controller';
import * as express from 'express';
const router = express.Router();
router
    .get('/listUsers',listUsers)
    .get('/userDetails',userDetails)
    .post('/userStatus',adminPanel)
    .post('/deletePosition',positionDeletion)
export default router;
