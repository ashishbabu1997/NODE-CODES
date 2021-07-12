import { getSkills,getOrderedSkills, addSkills, updateSkills, deleteSkills,getSKillNamesAsKeyController } from './SkillsController';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import updateCompanyProfileSchema from './schemas/updateCompanyProfileSchema';
import updateCompanyMaskingSchema from './schemas/updateCompanyMaskingSchema';

const router = express.Router();

router
    .get('/', getSkills)
    .post('/', addSkills)
    .get('/orderedSkills', getOrderedSkills)
    .get('/fetchSkillNamesAsKey', getSKillNamesAsKeyController)

    // .put('/', updateSkills)
    // .delete('/:skillId', deleteSkills)

export default router;

