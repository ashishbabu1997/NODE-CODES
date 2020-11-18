import { getAssessmentTrait, addAssessmentTrait, updateAssessmentTrait, deleteAssessmentTrait } from './assessmentTraitsController';
import * as express from 'express';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';
const router = express.Router();

router
    .get('/',jwtAuth, setData(), getAssessmentTrait)
    .post('/',jwtAuth, setData(), addAssessmentTrait)
    .put('/',jwtAuth, setData(), updateAssessmentTrait)
    .delete('/:assessmentTraitId',jwtAuth, setData(), deleteAssessmentTrait)

export default router;

