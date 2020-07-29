import { getTechnologyAreaTypes, addTechnologyArea, updateTechnologyArea, deleteTechnologyArea } from './TechnologyAreaController';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import updateCompanyProfileSchema from './schemas/updateCompanyProfileSchema';
import updateCompanyMaskingSchema from './schemas/updateCompanyMaskingSchema';

const router = express.Router();

router
    .get('/', getTechnologyAreaTypes)
    .post('/', addTechnologyArea)
    .put('/', updateTechnologyArea)
    .delete('/:technologyAreaId', deleteTechnologyArea)

export default router;

