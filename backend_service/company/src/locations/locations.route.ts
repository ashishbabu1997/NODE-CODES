import { getlocations, addLocations, updateLocations, deleteLocations } from './locations.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import addLocationSchema from './schemas/addLocationSchema';
import updateLocationSchema from './schemas/updateLocationSchema';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';
const router = express.Router();

router
    .get('/', jwtAuth, setData(), getlocations)
    .post('/', jwtAuth, setData(), validate(addLocationSchema), addLocations)
    .put('/', jwtAuth, setData(), validate(updateLocationSchema), updateLocations)
    .get('/:locationId',deleteLocations)

export default router;

