import { getlocations, addLocations, updateLocations, deleteLocations } from './locations.controller';
import * as express from 'express';
import validate from './middlewares/joiVaildation';
import addLocationSchema from './schemas/addLocationSchema';
import updateLocationSchema from './schemas/updateLocationSchema';

const router = express.Router();

router
    .get('/:companyId', getlocations)
    .post('/', validate(addLocationSchema), addLocations)
    .put('/', validate(updateLocationSchema), updateLocations)
    .delete('/:locationId', deleteLocations)

export default router;

