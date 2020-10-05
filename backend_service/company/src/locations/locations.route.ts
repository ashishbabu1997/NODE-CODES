import { getlocations, addLocations, updateLocations, deleteLocations } from './locations.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import addLocationSchema from './schemas/addLocationSchema';
import updateLocationSchema from './schemas/updateLocationSchema';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';
const router = express.Router();

router
    .get('/:companyId', jwtAuth, setData(), getlocations)
    .post('/', jwtAuth, setData(), validate(addLocationSchema), addLocations)
    .put('/', jwtAuth, setData(), validate(updateLocationSchema), updateLocations)
    .delete('/:locationId', jwtAuth, setData(), deleteLocations)

export default router;

