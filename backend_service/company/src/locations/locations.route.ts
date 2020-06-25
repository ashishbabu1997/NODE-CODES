import { getlocations ,addLocations} from './locations.controller';
import * as express from 'express';

const router = express.Router();

router
    .get('/:companyId', getlocations)
    .post('/', addLocations)


export default router;

