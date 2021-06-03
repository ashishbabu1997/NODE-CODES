import {getDesignations } from './designations.controller';
import * as express from 'express';
const router = express.Router();
router
    .get('/', getDesignations)

export default router;