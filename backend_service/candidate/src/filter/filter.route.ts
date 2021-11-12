import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';
import * as filterController from './filter.controller';
import * as filterSchema from './schema/filter.schema';
const router = express.Router();
router.get('/candidateFilter', jwtAuth, setData(), filterController.fetchCandidateFilters);
export default router;
