import * as candidateController from './candidates.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import approveRejectSchema from './schemas/approveRejectSchema';
import interviewRequestSchema from './schemas/interviewRequestSchema';
import candidateVettingSchema from './schemas/candidateVettingSchema';
import addCandidateToPositionSchema from './schemas/addCandidateToPositionSchema';
import * as schema from './schemas/modifyCandidateDetailsSchema';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';
import setProfileAuth from '../middlewares/setProfileAuth';

const router = express.Router();
router
.get('/listCandidates', jwtAuth, setData(), setProfileAuth([1,2,3,4]), candidateController.listCandidates)
.post('/listFreeCandidates', jwtAuth, setData(), setProfileAuth([1]), candidateController.listFreeCandidates)
.post('/listForAddFromListCandidates', jwtAuth, setData(), setProfileAuth([1,2]), candidateController.listForAddFromListCandidates)
.post('/candidateApproveReject', jwtAuth, setData(), setProfileAuth([1]), validate(approveRejectSchema), candidateController.approveRejectCandidates)
.post('/requestForInterview', jwtAuth, setData(), setProfileAuth([1,2]), validate(interviewRequestSchema), candidateController.interviewRequest)
.post('/review', jwtAuth, setData(), setProfileAuth([1,2]), candidateController.candidateReview)
.put('/candidateVettingStatus', jwtAuth, setData(), setProfileAuth([1]), validate(candidateVettingSchema), candidateController.candidateVettingStatus)
.delete('/', jwtAuth, setData(), setProfileAuth([1,3]), candidateController.deleteCandidateFromPosition)
.put('/linkCandidateToPosition', jwtAuth, setData(), setProfileAuth([1,3]), validate(addCandidateToPositionSchema), candidateController.addCandidateToPosition)
.delete('/deleteCandidate', jwtAuth, setData(), setProfileAuth([1]), candidateController.deleteCandidate)
.put('/updateLanguageProficiency',jwtAuth, setData(),setProfileAuth([1,3,4]), validate(schema.languageProficiencySchema), candidateController.updateLanguageProficiency)
.put('/updateAvailability',jwtAuth, setData(), setProfileAuth([1,3,4]), validate(schema.availabilitySchema), candidateController.updateAvailability)
.put('/updateProfileDetails',jwtAuth, setData(),setProfileAuth([1,3,4]),validate(schema.profileDetailSchema), candidateController.updateProfileDetails)
.put('/updateProject',jwtAuth, setData(),setProfileAuth([1,3,4]),validate(schema.projectSchema), candidateController.updateProject)
.put('/updateWorkExperience',jwtAuth, setData(),setProfileAuth([1,3,4]),validate(schema.workExperienceSchema), candidateController.updateWorkExperience)
.put('/updateEducation',jwtAuth, setData(),setProfileAuth([1,3,4]),validate(schema.educationSchema), candidateController.updateEducation)
.put('/updateAward',jwtAuth, setData(),setProfileAuth([1,3,4]),validate(schema.awardSchema), candidateController.updateAward)
.put('/updateSkill',jwtAuth, setData(),setProfileAuth([1,3,4]),validate(schema.skillSchema), candidateController.updateSkill)
.put('/updateSocialProfile',jwtAuth, setData(),setProfileAuth([1,3,4]),validate(schema.profileDetailSchema), candidateController.updateSocialProfile)
.put('/updateCloudProficiency',jwtAuth, setData(),setProfileAuth([1,3,4]),validate(schema.profileDetailSchema), candidateController.updateCloudProficiency)
.put('/updatePublication',jwtAuth, setData(),setProfileAuth([1,3,4]),validate(schema.publicationSchema), candidateController.updatePublication)
.put('/updateResumeFile',jwtAuth,setData(),setProfileAuth([1,3,4]),candidateController.updateResumeFile)
.put('/updateResumeData',jwtAuth,setData(),setProfileAuth([1]),candidateController.updateResumeData)
.put('/updateOverallWorkExperience',jwtAuth, setData(),setProfileAuth([1,3,4]),validate(schema.profileDetailSchema), candidateController.WorkExperience)
.get('/resume',jwtAuth, setData(), setProfileAuth([1,2,3,4]),candidateController.resumeDetails)
.get('/resumeSharedEmails',jwtAuth,setData(),candidateController.resumeSharedEmails)
.post('/resumeShareLink',jwtAuth, setData(),setProfileAuth([1,2]),candidateController.resumeShareLink)
.get('/initialSharedResumeData',candidateController.initialResumeData)
.get('/sharedResumeData',jwtAuth, setData(),setProfileAuth([1,2]),candidateController.sharedResumeData)
.put('/sharePdf',jwtAuth, setData(),setProfileAuth([1,2]),candidateController.getPdf)
.get('/getSharedEmailsForPdf',jwtAuth, setData(),setProfileAuth([1,2]),candidateController.getSharedEmailsForPdf)
.get('/sharedResumePdfData',candidateController.sharedResumePdfData)
.get('/getAssementOfCandidate',jwtAuth, setData(),setProfileAuth([1,2,3,4]),validate(interviewRequestSchema),candidateController.getAssesments)
.put('/changeCandidateAssignee',jwtAuth, setData(),setProfileAuth([1,2]),candidateController.changeAssignee)
.put('/updateCandidateEllowStage',jwtAuth, setData(),setProfileAuth([1]),candidateController.changeEllowRecruitmentStage)
.put('/rejectCandidateEllowStage',jwtAuth, setData(),setProfileAuth([1]),candidateController.rejectFromCandidateEllowRecruitment)
.get('/getAllAuditLogs',candidateController.getAuditLogs)
.post('/listFreeCandidatesOfHirer', jwtAuth, setData(),setProfileAuth([2]), candidateController.listResourcesOfHirer)
.post('/updateCandidateAvailability', jwtAuth, setData(), setProfileAuth([1,2,3,4]), candidateController.changeCandidateAvailability)
.post('/resumeParser',jwtAuth, setData(), setProfileAuth([1]),candidateController.resumeParser)
.post('/userSignup', candidateController.newUserSignup)
.post('/updateBlacklisted',candidateController.updateBlacklisted)
.post('/userSignup', candidateController.newUserSignup)
.get('/singleSignOn', candidateController.sigOn)
.post('/getEmployeeDetailsFromLinkedinToken', candidateController.getEmployeeDetailsFromLinkedin)
.get('/htmlResume',candidateController.getHtmlResume)

export default router;