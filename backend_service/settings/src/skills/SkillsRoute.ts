import { getSkills, addSkills, updateSkills, deleteSkills } from './SkillsController';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import updateCompanyProfileSchema from './schemas/updateCompanyProfileSchema';
import updateCompanyMaskingSchema from './schemas/updateCompanyMaskingSchema';

const router = express.Router();

router
    .get('/', getSkills)
    .post('/', addSkills)
    .put('/', updateSkills)
    .delete('/:skillId', deleteSkills)

export default router;

