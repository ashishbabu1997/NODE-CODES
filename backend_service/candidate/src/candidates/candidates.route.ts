import { candidateDetails,updateSocialAndCloud, updateResumeFile,updateProfileDetails,candidateVettingStatus,updateEducation,updateAward,updatePublication,updateProject,updateWorkExperience, updateAvailability,updateLanguageProficiency,listCandidates, listFreeCandidates, approveRejectCandidates, interviewRequest, candidateReview, deleteCandidateFromPosition, addCandidateToPosition, deleteCandidate,resumeDetails } from './candidates.controller';
import * as express from 'express';
import checkUserRole from '../middlewares/checkUserRole';
import validate from '../middlewares/joiVaildation';
import approveRejectSchema from './schemas/approveRejectSchema';
import interviewRequestSchema from './schemas/interviewRequestSchema';
import candidateVettingSchema from './schemas/candidateVettingSchema';
import addCandidateToPositionSchema from './schemas/addCandidateToPositionSchema';
import {languageProficiencySchema,availabilitySchema,profileDetailSchema,projectSchema,workExperienceSchema,educationSchema,awardSchema,publicationSchema} from './schemas/modifyCandidateDetailsSchema';


import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';

const router = express.Router();
router
    .get('/candidateDetails', jwtAuth, setData(),candidateDetails)
    .get('/listCandidates', jwtAuth, setData(), listCandidates)
    .get('/listFreeCandidates', jwtAuth, setData(), listFreeCandidates)
    .post('/candidateApproveReject', jwtAuth, setData(), validate(approveRejectSchema), approveRejectCandidates)
    .post('/requestForInterview', jwtAuth, setData(), validate(interviewRequestSchema), interviewRequest)
    .post('/review', jwtAuth, setData(), candidateReview)
    .put('/candidateVettingStatus', jwtAuth, setData(), validate(candidateVettingSchema), candidateVettingStatus)
    .delete('/', jwtAuth, setData(), deleteCandidateFromPosition)
    .put('/linkCandidateToPosition', jwtAuth, setData(), validate(addCandidateToPositionSchema), addCandidateToPosition)
    .delete('/deleteCandidate', jwtAuth, setData(), deleteCandidate)
    .put('/updateLanguageProficiency',jwtAuth, setData(),validate(languageProficiencySchema), updateLanguageProficiency)
    .put('/updateAvailability',jwtAuth, setData(),validate(availabilitySchema), updateAvailability)
    .put('/updateProfileDetails',jwtAuth, setData(),validate(profileDetailSchema), updateProfileDetails)
    .put('/updateProject',jwtAuth, setData(),validate(projectSchema), updateProject)
    .put('/updateWorkExperience',jwtAuth, setData(),validate(workExperienceSchema), updateWorkExperience)
    .put('/updateEducation',jwtAuth, setData(),validate(educationSchema), updateEducation)
    .put('/updateAward',jwtAuth, setData(),validate(awardSchema), updateAward)
    .put('/updateSocialAndCloud',jwtAuth, setData(),validate(profileDetailSchema), updateSocialAndCloud)
    .put('/updatePublication',jwtAuth, setData(),validate(publicationSchema), updatePublication)
    .put('/updateResumeFile',jwtAuth,setData(),validate(profileDetailSchema),updateResumeFile)
    .get('/resume',jwtAuth, setData(), resumeDetails)

    
export default router;
