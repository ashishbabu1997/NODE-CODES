import { listUsers,userDetails,adminPanel,registeredUserList } from './admin.controller';
import * as express from 'express';
const router = express.Router();
router
    .get('/listUsers',listUsers)
    .get('/userDetails',userDetails)
    .post('/userStatus',adminPanel)
    .get('/registeredUserList',registeredUserList)
export default router;