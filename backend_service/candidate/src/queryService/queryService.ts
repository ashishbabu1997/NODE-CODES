import candidateQuery from '../candidates/query/candidates.query';
import freelancerQuery from '../freelancer/query/freelancer.query';

const currentTime = Math.floor(Date.now() );


// ------------------------------------------ Modify Resume builder queries ---------------------------------------//

export const modifyCandidateProfileDetailsQuery = (_body) => {
    return {
        name: 'modify-candidate-ProfileDetails',
        text: candidateQuery.modifyProfileDetails,
        values:[_body.candidateId,_body.firstName,_body.lastName,_body.description,_body.image,_body.citizenship,_body.residence,_body.phoneNumber,_body.email,currentTime,_body.employeeId,_body.candidatePositionName],
    }
}

export const modifyCandidateAvailabilityQuery = (_body) => {
    return {
        name: 'modify-candidate-availability',
        text: candidateQuery.modifyCandidateAvailability,
        values: [_body.candidateId,_body.availability,_body.typeOfAvailability,_body.readyToStart, currentTime, _body.employeeId],
    }
}


export const addWorkExperiences = (_body) => {
    return {
        name: 'add-work-experiences',
        text: candidateQuery.addExperience,
        values: [_body.candidateId,_body.workExperience,_body.remoteWorkExperience,_body.cost,_body.billingTypeId,_body.currencyTypeId,currentTime,_body.employeeId],
    }
}

export const insertLanguageProficiencyQuery = (_body) => {
    return {
        name: 'insert-candidate-language',
        text: candidateQuery.insertLanguageProficiency,
        values: [_body.candidateId,_body.languageId,_body.proficiency, _body.employeeId,currentTime],
    }
}
export const modifyLanguageProficiencyQuery = (_body) => {
    return {
        name: 'modify-candidate-language',
        text: candidateQuery.modifyLanguageProficiency,
        values: [_body.candidateLanguageId,_body.candidateId,_body.languageId,_body.proficiency, currentTime, _body.employeeId],
    }
}

export const deleteLanguageProficiencyQuery = (_body) => {
    return {
        name: 'delete-candidate-language',
        text: candidateQuery.deleteLanguageProficiency,
        values: [_body.candidateLanguageId, currentTime, _body.employeeId],
    }
}

export const insertCandidateProjectsQuery = (_body) => {
    return {
        name: 'insert-candidate-projects',
        text: candidateQuery.insertCandidateProject,
        values: [_body.candidateId,_body.projectName,_body.clientName,_body.projectDescription,_body.projectLink,_body.extraProject,_body.skills, _body.employeeId,currentTime,_body.contribution,_body.doneFor,_body.role],
    }
}

export const modifyCandidateProjectsQuery = (_body) => {
    return {
        name: 'modify-candidate-projects',
        text: candidateQuery.modifyCandidateProject,
        values: [_body.candidateProjectId,_body.candidateId,_body.projectName,_body.clientName,_body.projectDescription,_body.projectLink,_body.extraProject,_body.skills, currentTime, _body.employeeId,_body.contribution,_body.doneFor,_body.role],
    }
}

export const deleteCandidateProjectsQuery = (_body) => {
    return {
        name: 'delete-candidate-projects',
        text: candidateQuery.deleteCandidateProject,
        values: [_body.candidateProjectId,currentTime,_body.employeeId],
    }
}

export const insertCandidateWorkHistoryQuery = (_body)=>{
    return {
        name: 'insert-candidate-work-history',
        text: candidateQuery.insertCandidateWorkHistory,
        values: [_body.candidateId,_body.companyName,_body.description,_body.logo,_body.startDate,_body.endDate,_body.stillWorking,_body.employeeid,currentTime,_body.positionName],
    }
}

export const modifyCandidateWorkHistoryQuery = (_body) => {
    return {
        name: 'modify-candidate-work-history',
        text: candidateQuery.modifyCandidateWorkHistory,
        values: [_body.candidateWorkExperienceId,_body.candidateId,_body.companyName,_body.description,_body.logo,_body.startDate,_body.endDate,_body.stillWorking,currentTime,_body.employeeid,_body.positionName],
    }
}

export const deleteCandidateWorkHistoryQuery = (_body) => {
    return {
        name: 'delete-candidate-work-history',
        text: candidateQuery.deleteCandidateWorkHistory,
        values: [_body.candidateWorkExperienceId,currentTime,_body.employeeId],
    }
}

export const insertCandidateEducationQuery = (_body) => {
    return {
        name: 'insert-candidate-education',
        text: candidateQuery.insertCandidateEducation,
        values: [_body.candidateId,_body.degree,_body.college,_body.startDate,_body.endDate,_body.employeeid,currentTime],
        
    }
}

export const modifyCandidateEducationQuery = (_body) => {
    return {
        name: 'modify-candidate-education',
        text: candidateQuery.modifyCandidateEducation,
        values: [_body.candidateEducationId,_body.candidateId,_body.degree,_body.college,_body.startDate,_body.endDate,currentTime,_body.employeeId],
    }
}

export const deleteCandidateEducationQuery = (_body) => {
    return {
        name: 'delete-candidate-education',
        text: candidateQuery.deleteCandidateEducation,
        values: [_body.candidateEducationId,currentTime,_body.employeeId],   
    }
}

export const deleteCandidateCloudQuery = (_body) => {
    return {
        name: 'delete-candidate-cloud-proficiency',
        text: candidateQuery.deleteCloud,
        values: [_body.candidateId,_body.idSet,_body.employeeId,currentTime],   
    }
}

export const insertCandidateCloudQuery = (_body) => {
    return {
        name: 'insert-candidate-cloud-proficiency',
        text: candidateQuery.modifyCloud,
        values: [_body.candidateId,_body.idSet,_body.employeeId,currentTime],
    }
}

export const insertCandidateSocialQuery = (_body) => {
    return {
        name: 'insert-candidate-social-profile',
        text: candidateQuery.modifySocial,
        values: [_body.candidateId,_body.github,_body.githubLink,_body.linkedin,_body.linkedinLink,_body.stackoverflow,_body.stackoverflowLink,_body.kaggle,_body.kaggleLink,_body.employeeId,currentTime],
    }
}

export const insertCandidatePublicationQuery = (_body) => {
    return {
        name: 'insert-candidate-Publication',
        text: candidateQuery.insertCandidatePublication,
        values: [_body.candidateId,_body.title,_body.publishedYear,_body.link,_body.employeeId,currentTime],    }
    }
    
    export const modifyCandidatePublicationQuery = (_body) => {
        return {
            name: 'modify-candidate-Publication',
            text: candidateQuery.modifyCandidatePublication,
            values: [_body.candidatePublicationId,_body.candidateId,_body.title,_body.publishedYear,_body.link,currentTime,_body.employeeId],
        }
    }
    
    export const deleteCandidatePublicationQuery = (_body) => {
        return {
            name: 'delete-candidate-Publication',
            text: candidateQuery.deleteCandidatePublication,
            values: [_body.candidatePublicationId,currentTime,_body.employeeId],
        }
    }
    
    export const insertCandidateAwardQuery = (_body) => {
        return {
            name: 'insert-candidate-Award',
            text: candidateQuery.insertCandidateAward,
            values: [_body.candidateId,_body.certificationId,_body.certifiedYear,_body.employeeId,currentTime],
        }
    }
    
    export const modifyCandidateAwardQuery = (_body) => {
        return {
            name: 'modify-candidate-Award',
            text: candidateQuery.modifyCandidateAward,
            values: [_body.candidateAwardId,_body.candidateId,_body.certificationId,_body.certifiedYear,currentTime,_body.employeeId],
        }
    }
    
    export const deleteCandidateAwardQuery = (_body) => {
        return {
            name: 'delete-candidate-Award',
            text: candidateQuery.deleteCandidateAward,
            values: [_body.candidateAwardId,currentTime,_body.employeeId],
        }
    }
    export const insertCandidateSkillQuery = (_body) => {
        return {
            name: 'insert-candidate-skill',
            text: candidateQuery.insertCandidateSkill,
            values: {candidateid:_body.candidateId,skillid:_body.skillId,preferred:_body.preferred, competency:_body.competency,yoe:_body.yoe, skillversion:_body.skillVersion,currenttime:currentTime, employeeid:_body.employeeId},
        }
    }
    
    export const modifyCandidateSkillQuery = (_body) => {
        return {
            name: 'modify-candidate-skill',
            text: candidateQuery.modifyCandidateSkill,
            values: {candidateskillid:_body.candidateSkillId,skillid:_body.skillId,preferred:_body.preferred, competency:_body.competency,yoe:_body.yoe,skillversion:_body.skillVersion,currenttime:currentTime, employeeid:_body.employeeId},
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
            values: [_body.candidateId,_body.resume,currentTime,_body.employeeId],
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
    
    export const fetchAssesementsLinks =(candidateId)=> {
        return {
            name: 'fetch-assesement-links',
            text: candidateQuery.fetchAssesmentLinks,
            values: [candidateId]
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
    
    export const addResumeShare =(_body)=> {
        return {
            name: 'add-resume-share',
            text: candidateQuery.addResumeShare,
            values: [_body.candidateId,_body.uniqueId,_body.employeeId,currentTime],
        }
    }
    
    export const getCandidateId =(_body)=> {
        return {
            name: 'fetch-candidateid',
            text: candidateQuery.fetchResumeDatafromUniqueId,
            values: [_body.uniqueId],
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
            values: [_body.candidateId,_body.github,_body.githubLink,_body.linkedin,_body.linkedinLink,_body.stackoverflow,_body.stackoverflowLink,_body.employeeId,currentTime],
        }
    }
    
    export const addDefaultTraits = (_body) => {
        return {
            name: 'add-default-traits',
            text: freelancerQuery.addDefaultAssessmentTraits,
            values: [_body.candidateId, _body.employeeId, currentTime],
        }
    }
    
    export const addSkillRelatedTraits = (_body) => {
        return {
            name: 'add-skill-based-traits',
            text: freelancerQuery.addSkillBasedAssesmentTraits,
            values: [_body.candidateId, _body.employeeId, currentTime],
        }
    }