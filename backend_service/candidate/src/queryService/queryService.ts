import candidateQuery from '../candidates/query/candidates.query';
import freelancerQuery from '../freelancer/query/freelancer.query';
import filterQuery from '../filter/query/filter.query';
import hiringQuery from '../hiring/query/hiring.query';



const currentTime = () => {return new Date().getTime()} 


// ------------------------------------------ Modify Resume builder queries ---------------------------------------//

export const modifyCandidateProfileDetailsQuery = (_body) => {
    return {
        name: 'modify-candidate-ProfileDetails',
        text: candidateQuery.modifyProfileDetails,
        values:[_body.candidateId,_body.firstName,_body.lastName,_body.description,_body.image,_body.citizenship,_body.residence,_body.phoneNumber,_body.email,currentTime(),_body.employeeId,_body.candidatePositionName,_body.sellerCompanyId],
    }
}
export const getFreelancerCompany = (_body) => {
    return {
        name: 'get-freelancer-companyid',
        text: candidateQuery.getFreelancerCompanyId,
        values:[]
    
}
}
export const modifyCandidateAvailabilityQuery = (_body) => {
    return {
        name: 'modify-candidate-availability',
        text: candidateQuery.modifyCandidateAvailability,
        values: [_body.candidateId,_body.availability,_body.typeOfAvailability,_body.readyToStart, currentTime(), _body.employeeId],
    }
}


export const addWorkExperiences = (_body) => {
    return {
        name: 'add-work-experiences',
        text: candidateQuery.addExperience,
        values: [_body.candidateId,_body.workExperience,_body.remoteWorkExperience,_body.cost,_body.billingTypeId,_body.currencyTypeId,currentTime(),_body.employeeId],
    }
}

export const insertLanguageProficiencyQuery = (_body) => {
    return {
        name: 'insert-candidate-language',
        text: candidateQuery.insertLanguageProficiency,
        values: [_body.candidateId,_body.languageId,_body.proficiency, _body.employeeId,currentTime()],
    }
}
export const modifyLanguageProficiencyQuery = (_body) => {
    return {
        name: 'modify-candidate-language',
        text: candidateQuery.modifyLanguageProficiency,
        values: [_body.candidateLanguageId,_body.candidateId,_body.languageId,_body.proficiency, currentTime(), _body.employeeId],
    }
}

export const deleteLanguageProficiencyQuery = (_body) => {
    return {
        name: 'delete-candidate-language',
        text: candidateQuery.deleteLanguageProficiency,
        values: [_body.candidateLanguageId, currentTime(), _body.employeeId],
    }
}

export const insertCandidateProjectsQuery = (_body) => {
    return {
        name: 'insert-candidate-projects',
        text: candidateQuery.insertCandidateProject,
        values: [_body.candidateId,_body.projectName,_body.clientName,_body.projectDescription,_body.projectLink,_body.extraProject,_body.skills, _body.employeeId,currentTime(),_body.contribution,_body.doneFor,_body.role],
    }
}

export const modifyCandidateProjectsQuery = (_body) => {
    return {
        name: 'modify-candidate-projects',
        text: candidateQuery.modifyCandidateProject,
        values: [_body.candidateProjectId,_body.candidateId,_body.projectName,_body.clientName,_body.projectDescription,_body.projectLink,_body.extraProject,_body.skills, currentTime(), _body.employeeId,_body.contribution,_body.doneFor,_body.role],
    }
}

export const deleteCandidateProjectsQuery = (_body) => {
    return {
        name: 'delete-candidate-projects',
        text: candidateQuery.deleteCandidateProject,
        values: [_body.candidateProjectId,currentTime(),_body.employeeId],
    }
}

export const insertCandidateWorkHistoryQuery = (_body)=>{
    return {
        name: 'insert-candidate-work-history',
        text: candidateQuery.insertCandidateWorkHistory,
        values: [_body.candidateId,_body.companyName,_body.description,_body.logo,_body.startDate,_body.endDate,_body.stillWorking,_body.employeeId,currentTime(),_body.positionName],
    }
}

export const modifyCandidateWorkHistoryQuery = (_body) => {
    return {
        name: 'modify-candidate-work-history',
        text: candidateQuery.modifyCandidateWorkHistory,
        values: [_body.candidateWorkExperienceId,_body.candidateId,_body.companyName,_body.description,_body.logo,_body.startDate,_body.endDate,_body.stillWorking,currentTime(),_body.employeeId,_body.positionName],
    }
}

export const deleteCandidateWorkHistoryQuery = (_body) => {
    return {
        name: 'delete-candidate-work-history',
        text: candidateQuery.deleteCandidateWorkHistory,
        values: [_body.candidateWorkExperienceId,currentTime(),_body.employeeId],
    }
}

export const insertCandidateEducationQuery = (_body) => {
    return {
        name: 'insert-candidate-education',
        text: candidateQuery.insertCandidateEducation,
        values: [_body.candidateId,_body.degree,_body.college,_body.startDate,_body.endDate,_body.employeeId,currentTime()],
        
    }
}

export const modifyCandidateEducationQuery = (_body) => {
    return {
        name: 'modify-candidate-education',
        text: candidateQuery.modifyCandidateEducation,
        values: [_body.candidateEducationId,_body.candidateId,_body.degree,_body.college,_body.startDate,_body.endDate,currentTime(),_body.employeeId],
    }
}

export const deleteCandidateEducationQuery = (_body) => {
    return {
        name: 'delete-candidate-education',
        text: candidateQuery.deleteCandidateEducation,
        values: [_body.candidateEducationId,currentTime(),_body.employeeId],   
    }
}

export const deleteCandidateCloudQuery = (_body) => {
    return {
        name: 'delete-candidate-cloud-proficiency',
        text: candidateQuery.deleteCloud,
        values: [_body.candidateId,_body.idSet,_body.employeeId,currentTime()],   
    }
}

export const insertCandidateCloudQuery = (_body) => {
    return {
        name: 'insert-candidate-cloud-proficiency',
        text: candidateQuery.modifyCloud,
        values: [_body.candidateId,_body.idSet,_body.employeeId,currentTime()],
    }
}

export const insertCandidateSocialQuery = (_body) => {
    return {
        name: 'insert-candidate-social-profile',
        text: candidateQuery.modifySocial,
        values: [_body.candidateId,_body.github,_body.githubLink,_body.linkedin,_body.linkedinLink,_body.stackoverflow,_body.stackoverflowLink,_body.kaggle,_body.kaggleLink,_body.employeeId,currentTime()],
    }
}

export const insertCandidatePublicationQuery = (_body) => {
    return {
        name: 'insert-candidate-Publication',
        text: candidateQuery.insertCandidatePublication,
        values: [_body.candidateId,_body.title,_body.publishedYear,_body.link,_body.employeeId,currentTime()],    }
    }
    
    export const modifyCandidatePublicationQuery = (_body) => {
        return {
            name: 'modify-candidate-Publication',
            text: candidateQuery.modifyCandidatePublication,
            values: [_body.candidatePublicationId,_body.candidateId,_body.title,_body.publishedYear,_body.link,currentTime(),_body.employeeId],
        }
    }
    
    export const deleteCandidatePublicationQuery = (_body) => {
        return {
            name: 'delete-candidate-Publication',
            text: candidateQuery.deleteCandidatePublication,
            values: [_body.candidatePublicationId,currentTime(),_body.employeeId],
        }
    }
    
    export const insertCandidateAwardQuery = (_body) => {
        return {
            name: 'insert-candidate-Award',
            text: candidateQuery.insertCandidateAward,
            values: [_body.candidateId,_body.certificationId,_body.certifiedYear,_body.employeeId,currentTime()],
        }
    }
    
    export const modifyCandidateAwardQuery = (_body) => {
        return {
            name: 'modify-candidate-Award',
            text: candidateQuery.modifyCandidateAward,
            values: [_body.candidateAwardId,_body.candidateId,_body.certificationId,_body.certifiedYear,currentTime(),_body.employeeId],
        }
    }
    
    export const deleteCandidateAwardQuery = (_body) => {
        return {
            name: 'delete-candidate-Award',
            text: candidateQuery.deleteCandidateAward,
            values: [_body.candidateAwardId,currentTime(),_body.employeeId],
        }
    }
    export const insertCandidateSkillQuery = (_body) => {
        return {
            name: 'insert-candidate-skill',
            text: candidateQuery.insertCandidateSkill,
            values: {candidateid:_body.candidateId,skillid:_body.skillId,preferred:_body.preferred, competency:_body.competency,yoe:_body.yoe, skillversion:_body.skillVersion,currenttime:currentTime(), employeeid:_body.employeeId},
        }
    }
    
    export const modifyCandidateSkillQuery = (_body) => {
        return {
            name: 'modify-candidate-skill',
            text: candidateQuery.modifyCandidateSkill,
            values: {candidateskillid:_body.candidateSkillId,skillid:_body.skillId,preferred:_body.preferred, competency:_body.competency,yoe:_body.yoe,skillversion:_body.skillVersion,currenttime:currentTime(), employeeid:_body.employeeId},
        }
    }
    
    export const deleteCandidateSkillQuery = (_body) => {
        return {
            name: 'delete-candidate-skill',
            text: candidateQuery.deleteCandidateSkill,
            values: [_body.candidateSkillId],
        }
    }
    export const updateResumeFile = (_body) => {
        return {
            name: 'update-resumeFile',
            text: candidateQuery.modifyResumeFile,
            values: [_body.candidateId,_body.resume,currentTime(),_body.employeeId],
        }
    }
    export const updateResumeForNewEntry = (_body) => {
        return {
            name: 'update-resumeFile-for-new-candidate',
            text: candidateQuery.insertResumeFile,
            values: [_body.resume,currentTime(),_body.employeeId],
        }
    }
    
    // *******************************************************************************************************************************//
    
    // -------------------------------------------Fetch Resume value queries -------------------------------------------------//
    
    export const fetchProfile = (candidateId) => {
        return {
            name: 'fetch-profile-details',
            text: candidateQuery.getAllProfileDetails,
            values: [candidateId],
        }
    }
    
    export const fetchSkills = (candidateId) => {
        return {
            name: 'fetch-skill-details',
            text: candidateQuery.fetchSkillDetails,
            values: [candidateId],
        }
    }
    
    export const fetchProjects = (candidateId) => {
        return {
            name: 'fetch-project-details',
            text: candidateQuery.fetchProjectDetails,
            values: [candidateId],
        }
    }
    
    export const fetchAssesements = (candidateId) => {
        return {
            name: 'fetch-assesement-details',
            text: candidateQuery.fetchAssesmentDetails,
            values: [candidateId],
        }
    }
    
    export const fetchWorkExperience =(candidateId)=> {
        return {
            name: 'fetch-work-experience-details',
            text: candidateQuery.fetchWorkExperienceDetails,
            values: [candidateId],
        }
    }
    
    export const fetchEducations =(candidateId)=> {
        return {
            name: 'fetch-education-details',
            text: candidateQuery.fetchEducationDetails,
            values: [candidateId],
        }
    }
    
    export const fetchSocialProfile =(candidateId)=> {
        return {
            name: 'fetch-social-profile',
            text: candidateQuery.fetchSocialProfile,
            values: [candidateId],
        }
    }
    
    export const fetchCloudProficiency =(candidateId)=> {
        return {
            name: 'fetch-cloud-proficiency',
            text: candidateQuery.fetchCloudProficiency,
            values: [candidateId],
        }
    }
    
    export const fetchPublications =(candidateId)=> {
        return {
            name: 'fetch-publications-details',
            text: candidateQuery.fetchPublicationDetails,
            values: [candidateId],
        }
    }
    
    export const fetchAwards =(candidateId)=> {
        return {
            name: 'fetch-awards-details',
            text: candidateQuery.fetchAwardDetails,
            values: [candidateId],
        }
    }
    
    export const fetchLanguages =(candidateId)=> {
        return {
            name: 'fetch-language-details',
            text: candidateQuery.fetchLanguageDetails,
            values: [candidateId],
        }
    }
    
    // *******************************************************************************************************************************//
    // -------------------------------------------Resume share queries-------------------------------------------------//
    
    export const getSharedEmails =(_body)=> {
        return {
            name: 'fetch-shared-emails',
            text: candidateQuery.getSharedEmails,
            values: [_body.candidateId],
        }
    }
    
    export const addResumeShare =(_body)=> {
        return {
            name: 'add-resume-share',
            text: candidateQuery.addResumeShare,
            values: [_body.candidateId,_body.uniqueId,_body.sharedEmails,_body.employeeId,currentTime()],
        }
    }
    export const getDomainFromEmployeeId = (_body)=> {
        return {
            name: 'fetch-domain-from-employeeid',
            text: candidateQuery.getDomainFromEmployeeId,
            values: [_body.employeeId],
        }
    }
    
    export const getCandidateId =(_body)=> {
        return {
            name: 'fetch-candidateid',
            text: candidateQuery.fetchCandidateIdfromResumeId,
            values: [_body.token],
        }
    }
    
    export const getEmailFromEmployeeId =(_body)=> {
        return {
            name: 'fetch-email-from-employeeid',
            text: candidateQuery.getEmployeeEmailFromId,
            values: [_body.employeeId],
        }
    }
    
    //pdf share
    export const saveSharedEmailsForpdf =(_body)=> {
        return {
            name: 'save-resume-share-emails-pdf',
            text: candidateQuery.saveSharedEmailsForpdf,
            values: {candidateid:_body.candidateId,sharedemails:_body.sharedEmails,employeeid:_body.employeeId,currenttime:currentTime()},
        }
    }
    export const getSharedEmailsPdf =(_body)=> {
        return {
            name: 'fetch-resume-share-emails-pdf',
            text: candidateQuery.getSharedEmailsForpdf,
            values: [_body.candidateId],
        }
    }
    
    export const changeAvailabilityOfCandidate =(_body)=> {
        return {
            name: 'update-availability',
            text: candidateQuery.updateCandidateAvailability,
            values: [_body.candidateId,_body.availability],
        }
    }

    export const changeBlacklistedOfCandidate =(_body)=> {
        return {
            name: 'update-blacklisted',
            text: candidateQuery.updateCandidateBlacklisted,
            values: [_body.candidateId,currentTime(),_body.employeeId],
        }
    }
    export const linkedinLoginMailCheck =(_body)=> {
        return {
            name: 'linkedin-email-check',
            text: candidateQuery.employeeLogin,
            values: [_body.email],
        }
    }
    export const insertLinkedinToCandidate =(_body)=> {
        return {
            name: 'insert-in-candidate',
            text: candidateQuery.insertIntoCandidate,
            values: [_body.firstName,_body.lastName,_body.email,4,currentTime()],
        }
    }
    export const insertLinkedinToCandidateEmployee =(_body)=> {
        return {
            name: 'insert-in-candidate-employee',
            text: candidateQuery.insertIntoCandidateEmployee,
            values: [_body.employeeId,_body.candidateId,currentTime()],
        }
    }
    export const insertEmployeeToken =(_body)=> {
        return {
            name: 'insert-employee-token',
            text: candidateQuery.insertEmployeeToken,
            values: [_body.token,_body.employeeId],
        }
    }
    export const getCompanyDetailsFromName =(_body)=> {
        return {
            name: 'get-company-details',
            text: candidateQuery.getCompanyDetails,
            values: [_body.companyName],
        }
    }
    export const insertLinkedinToEmployee =(_body)=> {
        return {
            name: 'insert-employee',
            text: candidateQuery.insertIntoEmployee,
            values: [_body.firstName,_body.lastName,_body.email,_body.cmpId,4,true,1],
        }
    }
    
    
    
    // *******************************************************************************************************************************//
    // -------------------------------------------Freelancer submit profile-------------------------------------------------//
    
    export const listJobPositions = (filterQuery:string,queryValues:object) => {
        return {
            name: 'list-freelancer-jobs',
            text: freelancerQuery.listFreelancerJobs + filterQuery,
            values: queryValues,
        }
    }
    
    export const modifySocialProfileAndStatusUpdate = (_body) => {
        return {
            name: 'insert-candidate-social-profile',
            text: freelancerQuery.modifySocialProfileAndStatusUpdate,
            values: [_body.candidateId,_body.github,_body.githubLink,_body.linkedin,_body.linkedinLink,_body.stackoverflow,_body.stackoverflowLink,_body.employeeId,currentTime()],
        }
    }
    
    export const addDefaultTraits = (_body) => {
        return {
            name: 'add-default-traits',
            text: freelancerQuery.addDefaultAssessmentTraits,
            values: {candidateid:_body.candidateId, employeeid:_body.employeeId, currenttime:currentTime()},
        }
    }
    
    export const candidateStatusUpdate = (_body) => {
        return {
            name: 'update-candidate-status',
            text: freelancerQuery.updateCandidateStatus,
            values: [_body.candidateId, _body.employeeId, currentTime(), _body.candidateStatus],
        }
    }
    
    export const getCandidateStatuses = (_body) => {
        return {
            name: 'get-candidate-status',
            text: candidateQuery.getStatus,
            values:[_body.candidateId]
        }
    }
    
    export const getNames =(_body)=> {
        return {
            name: 'get-employee-name',
            text: candidateQuery.getEmployeeName,
            values: [_body.employeeId],
        }
    }
    export const getSharedEmailsWithToken =(_body)=> {
        return {
            name: 'fetch-shared-emails',
            text: candidateQuery.getSharedEmailsWithTokens,
            values: [_body.token],
        }
    }
    
    export const getEmail =(_body)=> {
        return {
            name: 'fetch-email',
            text: candidateQuery.checkEMail,
            values: [_body.email],
        }
    }
    
    export const getCompanyId =(_body)=> {
        return {
            name: 'fetch-shared-emails',
            text: candidateQuery.getCompanyId,
            values: [_body.token],
        }
    }
    
    // *******************************************************************************************************************************//
    // -------------------------------------------Assesment traits realted queries-------------------------------------------------//
    export const updateEllowRecuiterReview =(_body)=> {        
        return {
            name: 'update-ellow-recuiter-review',
            text: candidateQuery.updateEllowRecuiterReview,
            values: {assignedto:_body.assignedTo,assessmentid:_body.candidateAssessmentId,assessmentcomment:_body.assessmentComment,link:_body.assessmentLink,linktext:_body.assessmentLinkText,attachments:_body.attachments,rating:_body.rating,employeeid:_body.employeeId,currenttime:currentTime()},        
        }
    }
    export const getCandidateProfileName =(_body)=> {        
        return {
            name: 'get-candidate-profile-name',
            text: candidateQuery.getCandidateProfileDetails,
            values:[_body.candidateId]
        }
    }
    export const setVettedStatus =(_body)=> {
        return {
            name: 'set-vetted-status',
            text: candidateQuery.setVettedStatus,
            values: {candidateid:_body.candidateId,employeeid:_body.employeeId,currenttime:currentTime()},        
        }
    }
    
    
    export const getDetailsPosition = (_body) => {
        return {
            name: 'get-candidate-status',
            text: freelancerQuery.getPositionsDetails,
            values:[_body.candidateId]
        }
    }
    
    export const getImageDetails = (_body) => {
        return {
            name: 'get-image-names',
            text: freelancerQuery.getImageNames,
            values:[_body.candidateId]
        }
    }
    export const getCompanyDetails = (_body) => {
        return {
            name: 'company-name',
            text: hiringQuery.getJoinedCompanyName,
            values:[_body.employeeId]
        }
    }
    export const getResourceCount = (_body) => {
        return {
            name: 'company-name',
            text: hiringQuery.fetchResourceCounts,
            values:[_body.positionId]
        }
    }
    export const updateJobStatus = (_body) => {
        return {
            name: 'update-status',
            text: hiringQuery.closeJobStatus,
            values:[_body.positionId]
        }
    }
    
    export const updateClosedCount = (_body) => {
        return {
            name: 'update-count',
            text: hiringQuery.updateResourceCount,
            values:[_body.positionId]
        }
    }
    
    export const getPositionsDetails = (_body) => {
        return {
            name: 'get-position-based-details',
            text: candidateQuery.getPositionName,
            values:[_body.positionId]
        }
    }
    
    export const changeCandidateAssignee = (_body) => {
        return {
            name: 'change-candidate-assignee',
            text: candidateQuery.changeAssignee,
            values:{candidateid:_body.candidateId,assigneeid:_body.assignedTo,employeeid:_body.employeeId,currenttime:currentTime()}
        }
    }
    
    export const changeEllowRecruitmentStage = (_body) => {
        return {
            name: 'change-candidate-ellow-hiring-stage',
            text: candidateQuery.changeEllowRecruitmentStage,
            values:{candidateid:_body.candidateId,stagename:_body.stageName,employeeid:_body.employeeId,currenttime:currentTime()}
        }
    }
    
    export const updateEllowStageStatus = (_body) => {
        return {
            name: 'update-candidate-ellow-stage-status',
            text: candidateQuery.ellowStageStatusUpdate,
            values:{candidateid:_body.candidateId,assessmentid:_body.candidateAssessmentId,employeeid:_body.employeeId,currenttime:currentTime()}
        }
    }
    
    export const updateAssigneeComment = (_body) => {
        return {
            name: 'change-candidate-assignee-comment',
            text: candidateQuery.updateAssigneeComments,
            values:[_body.candidateAssessmentId,_body.assigneeComment,currentTime()]
        }
    }
    
    export const rejectFromCandidateEllowRecruitment = (_body) => {
        return {
            name: 'reject-candidate-ellow-hiring',
            text: candidateQuery.rejectFromCandidateEllowRecruitment,
            values:{assessmentid:_body.candidateAssessmentId,assignedto:_body.assignedTo,comment:_body.assessmentComment,rating:_body.assessmentRating,link:_body.assessmentLink,linktext:_body.assessmentLinkText,employeeid:_body.employeeId,currenttime:currentTime()}
        }
    }
    export const getAuditLogs = (_body) => {
        return {
            name: 'get-all-audit-logs',
            text: candidateQuery.getAuditLogs,
            values:[]
        }
    }
    
    
    // *******************************************************************************************************************************//
    // -------------------------------------------Candidate filter related queries------------------------------------------------//
    
    export const listCandidates = (queryText,queryValues) => {
        return {
            name: 'get-free-candidates',
            text: queryText,
            values: queryValues 
        }
    }
    
    export const listCandidatesTotal = (queryText,queryValues) => {
        return {
            name: 'get-free-candidates-total',
            text: queryText,
            values: queryValues
        }
    }
    export const getJobReceivedId = (body) => {
        return {
            name: 'get-jobreceived-id',
            text: candidateQuery.getJobReceivedId,
            values: [body.positionId]
        }
    }
    
    export const listAddFromList = (queryText,queryValues) => {
        return {
            name: 'get-addfromlist-candidates',
            text: queryText,
            values: queryValues
        }
    }
    
    export const listCandidatesOfHirer = (queryText,queryValues) => {
        return {
            name: 'get-free-candidates-of-hirer',
            text: queryText,
            values: queryValues
        }
    }
    export const listCandidatesOfHirerCount = (queryText,queryValues) => {
        return{
            name: 'get-free-candidates-of-hirer-count',
            text: queryText,
            values: queryValues
        }
    }
    
    export const listAddFromListTotal = (queryText,queryValues) => {
        return {
            name: 'get-addfromlist-candidates-total',
            text: queryText,
            values: queryValues
        }
    }
    
    export const getCompanyNames = (_body) => {
        return {
            name: 'get-distinct-company-names',
            text: filterQuery.getDistinctCompanyNames,
        }
    }
    
    export const getfullNameAdmin = (_body) => {
        return {
            name: 'get-distinct-company-names',
            text: filterQuery.getfullNameAdmin,
        }
    }
    
    export const getPositionsAdmin = (_body) => {
        return {
            name: 'get-distinct-company-names',
            // text: filterQuery.getfullNameAdmin,
        }
    }
    
    export const getAssesmentDetails =(_body)=> {
        return {
            name: 'get-assesment-details-of-candidate-new',
            text: candidateQuery.getCandidateAssesmentDetails,
            values: [_body.candidateId],
        }
    }
    
    export const getAllocatedVettedStatus =(_body)=> {
        return {
            name: 'get-assesment-details',
            text: candidateQuery.getCandidateVettedAllocatedTo,
            values: [_body.candidateId],
        }
    }
    
    export const adminSignup =(_body)=> {
        return {
            name: 'details-admin',
            text: candidateQuery.getellowAdmins,
            values: []
        }
    }
    
    export const insertAuditLog = (_body) => {
        return {
            name: 'insert-audit-log',
            text: candidateQuery.insertLogs,
            values:['ellow hiring stage',_body.auditType,_body.auditLogComment,currentTime(),_body.employeeId]
        }
    }
    
    
    export const getAssigneeName = (_body) => {
        return {
            name: 'get-assignee-name',
            text: candidateQuery.getEmployeeName,
            values:[_body.assignedTo]
        }
    }
    export const getHirerAssigneeName = (_body) => {
        return {
            name: 'get-hirer-assignee-name',
            text: candidateQuery.getEmployeeName,
            values:[_body.assignedTo]
        }
    }
    export const getResourceAllocatedRecruiter = (_body) => {
        return {
            name: 'get-resource-allocated-recruiter',
            text: candidateQuery.fetchResourceAllocatedRecruiterDetails,
            values:[_body.candidateId]
        }
    }
    //---------------------------------------Hiring steps------------------------------------//
    export const insertAuditLogForHiring = (_body) => {
        return {
            name: 'insert-audit-log',
            text: candidateQuery.insertLogs,
            values:['client hiring steps',2,_body.auditLogComment,currentTime(),_body.employeeId]
        }
    }
    
    export const positionHiringStepsQuery = (_body) => {
        return {
            name: 'get-position-hiring-steps',
            text: hiringQuery.getPositionHiringStepsQuery,
            values:[_body.positionId],
        }
    }
    export const candidateHiringStepsQuery = (_body) => {
        return {
            name: 'get-candidate-client-hiring-steps',
            text: hiringQuery.candidateHiringStepsQuery,
            values:[_body.candidateId,_body.positionId],
        }
    }
    
    export const candidateAllPositionHiringStepsQuery = (_body) => {
        return {
            name: 'get-all-positions-candidate-client-hiring-steps',
            text: hiringQuery.candidateAllPositionsHiringStepsQuery,
            values:[_body.candidateId],
        }
    }
    export const candidateAllPositionHiringStepsOfHirerQuery = (_body) => {
        return {
            name: 'get-all-positions-candidate-client-hiring-steps-of-hirer',
            text: hiringQuery.candidateAllPositionsHiringStepsOfHirerQuery,
            values:[_body.candidateId,_body.companyId],
        }
    }
    
    export const candidatePositionDetailsQuery = (_body) => {
        return {
            name: 'get-candidate-current-step',
            text: hiringQuery.candidatePositionDetails,
            values:[_body.candidateId,_body.positionId],
        }
    }
    
    export const getDefaultHiringStepsQuery = () => {
        return {
            name: 'get-default-client-hiring-steps',
            text: hiringQuery.getDefaultHiringStepsQuery,
            values:[],
        }
    }
    
    export const addCandidateHiringSteps = (_body) => {
        return {
            name: 'add-candidate-client-hiring-steps',
            text: hiringQuery.addCandidatePositionHiringSteps,
            values: [_body.positionId, _body.candidateId, _body.employeeId, currentTime()],
        }
    }
    
    export const updateHiringStepDetailsQuery = (_body) => {
        return {
            name: 'update-candidate-client-hiring-step-details',
            text: hiringQuery.updateHiringStepDetails,
            values: {candidateClientHiringStepId:_body.candidateClientHiringStepId,assignedTo:_body.assignedTo,candidateHiringStepComment:_body.candidateHiringStepComment,attachments:_body.attachments,stepLink:_body.stepLink,stepLinkText:_body.stepLinkText,currenttime:currentTime(),employeeid:_body.employeeId,hiringAssesmentValue:_body.hiringAssesmentValue},
        }
    }
    
    export const moveCandidateHiringStepQuery = (_body) => {
        return {
            name: 'move-tostep-client-hiring',
            text: hiringQuery.moveCandidateHiringStep,
            values: {candidateClientHiringStepId:_body.candidateClientHiringStepId,candidateHiringStepOrder:_body.candidateHiringStepOrder,candidateid:_body.candidateId,positionid:_body.positionId,currenttime:currentTime(),employeeid:_body.employeeId,assignedto:_body.assignedTo},
        }
    }
    
    export const updateAssigneeComments = (_body) => {
        return {
            name: 'update-candidatde-client-hiring',
            text: hiringQuery.updateAssigneeComments,
            values:[_body.candidateClientHiringStepId,_body.assigneeComment,currentTime()]
        }
    }
    
    export const updateCurrentStage = (_body) => {
        return {
            name: 'update-current-stage-candidate-position-table',
            text: hiringQuery.updateCurrentStage,
            values: {hiringstepname:_body.candidateHiringStepName,candidateid:_body.candidateId,positionid:_body.positionId,currenttime:currentTime(),employeeid:_body.employeeId},
        }
    }
    export const getPositionName = (_body) => {
        return {
            name: 'get-position-name',
            text: hiringQuery.getPositionNameFromId,
            values: [_body.positionId]
        }
    }
    export const getCompanyName = (_body) => {
        return {
            name: 'get-company-name',
            text: hiringQuery.getCompanyNameFromId,
            values: [_body.companyId]
        }
    }
    
    
    export const rejectFromHiringProcess = (_body) => {
        return {
            name: 'reject-candidate-client-hiring',
            text: hiringQuery.rejectFromHiringProcess,
            values: {assignedto:_body.assignedTo,candidateid:_body.candidateId,positionid:_body.positionId,id:_body.candidateClientHiringStepId,link:_body.stepLink,linktext:_body.stepLinkText,attachments:_body.attachments,comment:_body.candidateHiringStepComment,currenttime:currentTime(),employeeid:_body.employeeId},
        }
    }
    
    export const addNewStageForCandidate = (_body) => {
        return {
            name: 'add-new-candidate-client-hiring',
            text: hiringQuery.addNewStageForCandidate,
            values: {stepname:_body.candidateHiringStepName,steptype:_body.candidateHiringStepType,candidateid:_body.candidateId,positionid:_body.positionId,currenttime:currentTime(),employeeid:_body.employeeId},
        }
    }
    
    export const updateDefaultAssigneeQuery = (_body) => {
        return {
            name: 'update-assignee-candidate-client-hiring',
            text: hiringQuery.updateDefaultAssignee,
            values:{assignedto:_body.assignedTo,candidateid:_body.candidateId,positionid:_body.positionId,currenttime:currentTime(),employeeid:_body.employeeId},
        }
    }
    
    export const deletePositionHiringStep = (_body) => {
        return {
            name: 'delete-client-hiring-step-position',
            text: hiringQuery.deletePositionHiringStep,
            values: [_body.positionHiringStepId],
        }
    }
    
    
    export const updateMakeOfferValue = (_body) => {
        return {
            name: 'update-make-offer',
            text: hiringQuery.updateMakeOffer,
            values: {makeOffer:_body.hiringAssesmentValue,updatedOn:currentTime(),updatedBy:_body.employe,candidateId:_body.candidateId,positionId:_body.positionId},
        }
    }
    export const updateAvailabilityOfCandidate = (_body) => {
        return {
            name: 'update-candidate-availability',
            text: hiringQuery.updateCandidateAvailability,
            values:[_body.candidateId,false]
        }
    }
    export const getCandidateDetails = (_body) => {
        return {
            name: 'get-candidate-name',
            text: hiringQuery.getCandidateNames,
            values:[_body.candidateId]
        }
    }
    

     // *******************************************************************************************************************************//
    
    // -------------------------------------------Resume parser queries -------------------------------------------------//


     export const insertExtractedCandidateDetails = (data) => {
        return {
            name: 'insert-extracted-candidate-details',
            text: candidateQuery.insertExtractedCandidateDetails,
            values:{firstname:data.firstName, lastname:data.lastName, summary:data.summary, resume:data.resume, phone:data.phone, email:data.email, workexperience:data.overallWorkExperience, citizenship:data.citizenship, residence:data.city,positionname:data.designation,resumefilename:data.resumeFileName, candidatestatus:4, currenttime:currentTime(), employeeid:data.employeeId,resumedata:data.resumeData,companyid:data.freelancerCompanyId}
        }
    }
    export const insertDetailResume = (_body) => {
        return {
            name: 'insert-detail-resume',
            text: candidateQuery.insertDetailResumeQuery,
            values:[_body.candidatesId,_body.detailResume]
        }
    }


    export const insertExtractedCandidateSkills = (data) => {
        return {
            name: 'insert-extracted-candidate-skills',
            text: candidateQuery.insertExtractedCandidateSkills,
            values:{candidateid:data.candidateId, skillarray:data.skillArray, currenttime:currentTime(), employeeid:data.employeeId}
        }
    }

    export const insertExtractedCandidateProjectsQuery = (_body) => {
        return {
            name: 'insert-extracted-candidate-projects',
            text: candidateQuery.insertExtractedCandidateProject,
            values: {candidateid:_body.candidateId,projectname:_body.projectName,clientname:_body.clientName,description:_body.projectDescription,extractedskill:_body.skills,employeeid: _body.employeeId,currenttime:currentTime(),role:_body.projetRole},
        }
    }
    
    export const insertExtractedLanguagesQuery = (_body) => {
        return {
            name: 'insert-extracted-candidate-language',
            text: candidateQuery.insertExtractedLanguagesQuery,
            values: [_body.candidateId,_body.languages, _body.employeeId,currentTime()],
        }
    }