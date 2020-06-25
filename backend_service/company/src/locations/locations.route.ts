import { getlocations, addLocations, updateLocations, deleteLocations } from './locations.controller';
import * as express from 'express';

const router = express.Router();

router
    .get('/:companyId', getlocations)
    .post('/', addLocations)
    .put('/', updateLocations)
    .delete('/:locationId', deleteLocations)

export default router;

