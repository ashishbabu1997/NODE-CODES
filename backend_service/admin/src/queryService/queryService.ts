import notificationsQuery from '../notifications/query/notifications.query';
import adminQuery from '../admins/query/admin.query';

const currentTime = () => { return new Date().getTime() }

export const listquery = (_body) => {
    return {
        name: 'list-compnies',
        text: _body.queryText,
        values: _body.queryValues

    }
}
export const listQueryCount = (_body) => {
    return {
        name: 'list-companies-count',
        text: _body.queryCountText,
        values: _body.queryValues

    }
}

export const listNotifications = () => {
    return {
        name: 'list-notifications',
        text: notificationsQuery.listNotifications
    }
}

export const listHirerNotifications = (companyId) => {
    return {
        name: 'list-hirer-notifications',
        text: notificationsQuery.listHirerNotifications,
        values: [companyId]
    }
}

export const fetchCandidatePositionReports = (dateRange, groupBy) => {
    return {
        name: 'get-candidate-position-reports',
        text: adminQuery.candidatePositionReports + dateRange + groupBy
    }
}

export const fetchPositionReports = (dateRange, groupBy) => {
    return {
        name: 'get-position-reports',
        text: adminQuery.positionReports + dateRange + groupBy
    }
}

export const fetchCandidateReports = (dateRange, groupBy) => {
    return {
        name: 'get-candidate-reports',
        text: adminQuery.candidateReports + dateRange + groupBy
    }
}

export const fetchCompanyRegReports = (dateRange, groupBy) => {
    return {
        name: 'get-company-registration-reports',
        text: adminQuery.registrationReports + dateRange + groupBy
    }
}

export const fetchFreelancerReports = (dateRange, groupBy) => {
    return {
        name: 'get-freelancer-reports',
        text: adminQuery.freelancerReports + dateRange + groupBy
    }
}

// ----------------------------------------- Job category/ skill delete -------------------------------------------

export const deleteJobCategory = (_body) => {
    return {
        name: 'add-new-job-category',
        text: adminQuery.deleteJobCategory,
        values: [_body.jobCategoryId]
    }
}
export const closeHirerPositions = (companyId) => {
    return {
        name: 'close-hirer-positions',
        text: adminQuery.closeHirerPositions,
        values: [companyId]
    }
}

export const getJobCategoryPositionLinks = (_body) => {
    return {
        name: 'get-job-category-position-links',
        text: adminQuery.getJobCategoryPositionLinks,
        values: [_body.jobCategoryId]
    }
}

export const getJobCategoryCandidateLinks = (_body) => {
    return {
        name: 'get-job-category-candidate-links',
        text: adminQuery.getJobCategoryCandidateLinks,
        values: [_body.jobCategoryId]
    }
}

export const editJobCategory = (_body) => {
    return {
        name: 'edit-job-category-name',
        text: adminQuery.editJobCategory,
        values: [_body.jobCategoryId, _body.jobCategoryName, currentTime()]
    }
}

export const removeSkillsFromJobCategory = (_body) => {
    return {
        name: 'remove-skills-from-job-category',
        text: adminQuery.removeSkillsFromJobCategory,
        values: { id: _body.jobCategoryId, skill: _body.skillId }
    }
}

export const editSkill = (_body) => {
    return {
        name: 'edit-skill-name',
        text: adminQuery.editSkill,
        values: [_body.skillId, _body.skillName, currentTime()]
    }
}



export const removeSkill = (_body) => {
    return {
        name: 'remove-skills',
        text: adminQuery.removeSkill,
        values: [_body.skillId]
    }
}

export const getSkillPositionLinks = (_body) => {
    return {
        name: 'get-skill-position-links',
        text: adminQuery.getSkillPositionLinks,
        values: [_body.skillId]
    }
}

export const getSkillCandidateLinks = (_body) => {
    return {
        name: 'get-skill-candidate-links',
        text: adminQuery.getSkillCandidateLinks,
        values: [_body.skillId]
    }
}

export const removeResource = (_body) => {
    return {
        name: 'remove-resource',
        text: adminQuery.removeResource,
        values: [_body.candidateId]
    }
}

export const getResourcePositionLinks = (_body) => {
    return {
        name: 'get-resource-position-links',
        text: adminQuery.getResourcePositionLinks,
        values: [_body.candidateId]
    }
}
