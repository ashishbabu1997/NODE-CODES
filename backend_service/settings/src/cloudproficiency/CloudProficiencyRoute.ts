import { getCloudProficiency, addCloudProficiency, updateCloudProficiency, deleteCloudProficiency } from './CloudProficiencyController';
import * as express from 'express';

const router = express.Router();

router
    .get('/', getCloudProficiency)
    .post('/', addCloudProficiency)
    .put('/', updateCloudProficiency)
    .delete('/:cloudid', deleteCloudProficiency)

export default router;

