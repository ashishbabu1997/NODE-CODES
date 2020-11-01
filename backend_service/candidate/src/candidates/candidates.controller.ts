import { getCandidateDetails,modifySocialPresenceCloudProficiency,modifyProfileDetails,modifyCandidateAvailability,modifyEducation,modifyAward,modifyPublication,modifyCandidateWorkHistory,modifyCandidateProject, editVettingStatus,modifyLanguageProficiency, listCandidatesDetails, listFreeCandidatesDetails, candidateClearance, interviewRequestFunction, addCandidateReview, removeCandidateFromPosition, linkCandidateWithPosition, removeCandidate,getResume } from './candidates.manager';
import sendResponse from '../common/response/response';

export const candidateDetails = (req, res) => {
    const body = req.query;
    getCandidateDetails(body).then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data))
}
export const listCandidates = (req, res) => {
    const body = req.query;
    listCandidatesDetails(body).then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data))
}
export const listFreeCandidates = (req, res) => {
    const body = req.query;
    listFreeCandidatesDetails(body).then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data))
}
export const approveRejectCandidates = (req, res) => {
    const body = req.body;
    candidateClearance(body).then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data))
}

export const interviewRequest = (req, res) => {
    const body = req.body;
    interviewRequestFunction(body).then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data))
}

export const candidateReview = (req, res) => {
    const body = req.body;
    addCandidateReview(body).then((response: any) => sendResponse(res, response.code, 1, 201, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0, 401, error.message, error.data))
}
export const candidateVettingStatus = (req, res) => {
    const body = req.body;
    editVettingStatus(body).then((response: any) => sendResponse(res, response.code, 1, 201, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0, 401, error.message, error.data))
}

export const deleteCandidateFromPosition = (req, res) => {
    const body = req.query;
    removeCandidateFromPosition(body).then((response: any) => {
        sendResponse(res, response.code, 1, 203, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 403, error.message, error.data)
    })
}

export const addCandidateToPosition = (req, res) => {
    const body = req.body;
    linkCandidateWithPosition(body).then((response: any) => sendResponse(res, response.code, 1, 201, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0, 401, error.message, error.data))
}

export const deleteCandidate = (req, res) => {
    const body = req.query;
    removeCandidate(body).then((response: any) => {
        sendResponse(res, response.code, 1, 203, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 403, error.message, error.data)
    })
}

export const updateLanguageProficiency = (req, res) => {
    const body = req.body;
    modifyLanguageProficiency(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}


export const updateProfileDetails = (req, res) => {
    const body = req.body;
    modifyProfileDetails(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}
export const updateSocialAndCloud = (req, res) => {
    const body = req.body;
    modifySocialPresenceCloudProficiency(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}
export const updateAvailability = (req, res) => {
    const body = req.body;
    modifyCandidateAvailability(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}

export const updateProject = (req, res) => {
    const body = req.body;
    modifyCandidateProject(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}

export const updateWorkExperience = (req, res) => {
    const body = req.body;
    modifyCandidateWorkHistory(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}

export const updateEducation = (req, res) => {
    const body = req.body;
    modifyEducation(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}
export const updateAward = (req, res) => {
    const body = req.body;
    modifyAward(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}
export const updatePublication = (req, res) => {
    const body = req.body;
    modifyPublication(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}
export const resumeDetails = (req, res) => {
    const body = req.query;
    getResume(body).then((response: any) => sendResponse(res, response.code, 1, 201, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0, 401, error.message, error.data))
}