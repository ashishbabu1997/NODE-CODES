import * as candidateController from './candidates.controller';

import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import approveRejectSchema from './schemas/approveRejectSchema';
import interviewRequestSchema from './schemas/interviewRequestSchema';
import candidateVettingSchema from './schemas/candidateVettingSchema';
import addCandidateToPositionSchema from './schemas/addCandidateToPositionSchema';
import {languageProficiencySchema,skillSchema,availabilitySchema,profileDetailSchema,projectSchema,workExperienceSchema,educationSchema,awardSchema,publicationSchema} from './schemas/modifyCandidateDetailsSchema';

import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';

const router = express.Router();
router
    .get('/listCandidates', jwtAuth, setData(), candidateController.listCandidates)
    .get('/listFreeCandidates', jwtAuth, setData(), candidateController.listFreeCandidates)
    .get('/listForAddFromListCandidates', jwtAuth, setData(), candidateController.listForAddFromListCandidates)
    .post('/candidateApproveReject', jwtAuth, setData(), validate(approveRejectSchema), candidateController.approveRejectCandidates)
    .post('/requestForInterview', jwtAuth, setData(), validate(interviewRequestSchema), candidateController.interviewRequest)
    .post('/review', jwtAuth, setData(), candidateController.candidateReview)
    .put('/candidateVettingStatus', jwtAuth, setData(), validate(candidateVettingSchema), candidateController.candidateVettingStatus)
    .delete('/', jwtAuth, setData(), candidateController.deleteCandidateFromPosition)
    .put('/linkCandidateToPosition', jwtAuth, setData(), validate(addCandidateToPositionSchema), candidateController.addCandidateToPosition)
    .delete('/deleteCandidate', jwtAuth, setData(), candidateController.deleteCandidate)
    .put('/updateLanguageProficiency',jwtAuth, setData(),validate(languageProficiencySchema), candidateController.updateLanguageProficiency)
    .put('/updateAvailability',jwtAuth, setData(),validate(availabilitySchema), candidateController.updateAvailability)
    .put('/updateProfileDetails',jwtAuth, setData(),validate(profileDetailSchema), candidateController.updateProfileDetails)
    .put('/updateProject',jwtAuth, setData(),validate(projectSchema), candidateController.updateProject)
    .put('/updateWorkExperience',jwtAuth, setData(),validate(workExperienceSchema), candidateController.updateWorkExperience)
    .put('/updateEducation',jwtAuth, setData(),validate(educationSchema), candidateController.updateEducation)
    .put('/updateAward',jwtAuth, setData(),validate(awardSchema), candidateController.updateAward)
    .put('/updateSkill',jwtAuth, setData(),validate(skillSchema), candidateController.updateSkill)
    .put('/updateSocialProfile',jwtAuth, setData(),validate(profileDetailSchema), candidateController.updateSocialProfile)
    .put('/updateCloudProficiency',jwtAuth, setData(),validate(profileDetailSchema), candidateController.updateCloudProficiency)
    .put('/updatePublication',jwtAuth, setData(),validate(publicationSchema), candidateController.updatePublication)
    .put('/updateResumeFile',jwtAuth,setData(),validate(profileDetailSchema),candidateController.updateResumeFile)
    .put('/updateOverallWorkExperience',jwtAuth, setData(),validate(profileDetailSchema), candidateController.WorkExperience)
    .get('/resume',jwtAuth, setData(), candidateController.resumeDetails)
    .get('/resumeSharedEmails',jwtAuth, setData(),candidateController.resumeSharedEmails)
    .post('/resumeShareLink',jwtAuth, setData(),candidateController.resumeShareLink)
    .get('/initialSharedResumeData',candidateController.initialResumeData)
    .get('/sharedResumeData',jwtAuth, setData(),candidateController.sharedResumeData)
    .post('/userSignup', candidateController.newUserSignup)
    .put('/sharePdf',jwtAuth, setData(),candidateController.getPdf)
    .get('/getSharedEmailsForPdf',jwtAuth, setData(),candidateController.getSharedEmailsForPdf)
    .get('/sharedResumePdfData',candidateController.sharedResumePdfData)
    .get('/getAssementOfCandidate',jwtAuth, setData(),candidateController.getAssesments)
    .put('/changeCandidateAssignee',jwtAuth, setData(),candidateController.changeAssignee)
    .put('/updateCandidateEllowStage',jwtAuth, setData(),candidateController.changeEllowRecruitmentStage)
    .put('/rejectCandidateEllowStage',jwtAuth, setData(),candidateController.rejectFromCandidateEllowRecruitment)
    .get('/getAllAuditLogs',candidateController.getAuditLogs)

    
    export default router;