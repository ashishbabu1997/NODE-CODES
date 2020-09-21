import { getAssessmentTrait, addAssessmentTrait, updateAssessmentTrait, deleteAssessmentTrait } from './assessmentTraitsController';
import * as express from 'express';

const router = express.Router();

router
    .get('/', getAssessmentTrait)
    .post('/', addAssessmentTrait)
    .put('/', updateAssessmentTrait)
    .delete('/:assessmentTraitId', deleteAssessmentTrait)

export default router;

