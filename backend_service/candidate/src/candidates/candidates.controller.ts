import * as candidateManager from './candidates.manager';
import sendResponse from '../common/response/response';

export const getPdf = (req, res) => {
    const body = req.body;
    candidateManager.createPdfFromHtml(body).then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data))
}

export const listCandidates = (req, res) => {
    const body = req;
    candidateManager.listCandidatesDetails(body).then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data))
}
export const listFreeCandidates = (req, res) => {
    const body = req;
    candidateManager.listFreeCandidatesDetails(body).then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data))        
}

export const listForAddFromListCandidates = (req, res) => {
    const body = req;
    candidateManager.listAddFromListCandidates(body).then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data))
}

export const candidateReview = (req, res) => {
    const body = req.body;
    candidateManager.addCandidateReview(body).then((response: any) => sendResponse(res, response.code, 1, 201, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 401, error.message, error.data))
}

export const candidateVettingStatus = (req, res) => {
    const body = req.body;
    candidateManager.editVettingStatus(body).then((response: any) => sendResponse(res, response.code, 1, 201, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 401, error.message, error.data))
}

export const deleteCandidateFromPosition = (req, res) => {
    const body = req.body;
    candidateManager.removeCandidateFromPosition(body).then((response: any) => {
        sendResponse(res, response.code, 1, 203, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 403, error.message, error.data)
    })
}

export const addCandidateToPosition = (req, res) => {
    const body = req.body;
    candidateManager.linkCandidateWithPosition(body).then((response: any) => sendResponse(res, response.code, 1, 201, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 401, error.message, error.data))
}

export const deleteCandidate = (req, res) => {
    const body = req.query;
    candidateManager.removeCandidate(body).then((response: any) => {
        sendResponse(res, response.code, 1, 203, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 403, error.message, error.data)
    })
}

export const updateLanguageProficiency = (req, res) => {
    const body = req.body;
    candidateManager.modifyLanguageProficiency(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}


export const updateProfileDetails = (req, res) => {
    const body = req.body;
    candidateManager.modifyProfileDetails(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}
export const updateResumeFile = (req, res) => {
    const body = req.body;
    candidateManager.modifyResumeFile(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}

export const updateResumeData = (req, res) => {
    const body = req.body;
    candidateManager.modifyResumeData(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}

export const updateSocialProfile = (req, res) => {
    const body = req.body;
    candidateManager.modifySocialPresence(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}

export const updateCloudProficiency = (req, res) => {
    const body = req.body;
    candidateManager.modifyCloudProficiency(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}
export const updateAvailability = (req, res) => {
    const body = req.body;
    candidateManager.modifyCandidateAvailability(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}

export const updateProject = (req, res) => {
    const body = req.body;
    candidateManager.modifyCandidateProject(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}

export const updateWorkExperience = (req, res) => {
    const body = req.body;
    candidateManager.modifyCandidateWorkHistory(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}

export const updateEducation = (req, res) => {
    const body = req.body;
    candidateManager.modifyEducation(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}
export const updateAward = (req, res) => {
    const body = req.body;
    candidateManager.modifyAward(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}

export const updateSkill = (req, res) => {
    const body = req.body;
    candidateManager.modifySkill(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}

export const updatePublication = (req, res) => {
    const body = req.body;
    candidateManager.modifyPublication(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}
export const resumeDetails = (req, res) => {
    const body = req.query;
    candidateManager.getResume(body).then((response: any) => sendResponse(res, response.code, 1, 201, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 401, error.message, error.data))
}
export const WorkExperience = (req, res) => {
    const body = req.body;
    candidateManager.addWorkExperience(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}

export const resumeShareLink = (req, res) => {
    const body = req.body;
    candidateManager.addResumeShareLink(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}

export const resumeSharedEmails = (req, res) => {
    const body = req.query;
    candidateManager.getSharedEmails(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}

export const initialResumeData = (req, res) => {
    const body = req.query;
    candidateManager.initialSharedResumeData(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}

export const sharedResumeData = (req, res) => {
    const body = req.query;
    candidateManager.fetchResumeData(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}

export const getSharedEmailsForPdf = (req, res) => {
    const body = req.query;
    candidateManager.fetchSharedEmailsForPdf(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}

export const sharedResumePdfData = (req, res) => {
    const body = req.query;
    candidateManager.fetchResumeDataForPdf(body).then((response: any) => {
        sendResponse(res, response.code, 1, 201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, 401, error.message, error.data)
    })
}

export const newUserSignup = (req, res) => {
    const body = req.body;
    candidateManager.shareResumeSignup(body).then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data))
}

export const getAssesments = (req, res) => {
    const body = req.query;
    candidateManager.getCandidateAssesmentDetails(body).then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data))
}

export const changeAssignee = (req, res) => {
    const body = req.body;
    candidateManager.changeAssignee(body).then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data))
}

export const changeEllowRecruitmentStage = (req, res) => {
    const body = req.body;
    candidateManager.changeEllowRecruitmentStage(body).then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data))
}

export const rejectFromCandidateEllowRecruitment = (req, res) => {
    const body = req.body;
    candidateManager.rejectFromCandidateEllowRecruitment(body).then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data))
}
export const getAuditLogs = (req, res) => {
    const body = req.query;
    candidateManager.getAllAuditLogs(body).then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data))
}
export const listResourcesOfHirer = (req, res) => {
    const body = req;
    candidateManager.listHirerResources(body).then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data))
}

export const changeCandidateAvailability = (req, res) => {
    const body = req.body;
    candidateManager.changeAvailability(body).then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data))
}


export const resumeParser = (req, res) => {
    const body = req.body;
    candidateManager.resumeParser(body).then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data))
}


export const updateBlacklisted = (req, res) => {
    const body = req.body;
    candidateManager.changeBlacklisted(body).then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data))
}
export const sigOn = (req, res) => {
    const body = req.query;
    candidateManager.singleSignOn(body).then((response: any) => {
            res.writeHead(301,{Location: 'https://dev.ellow.io/candidate-login?token='+response.data.token});
            res.end();
    })
    .catch((error: any) => { res.writeHead(301,{Location: 'https://dev.ellow.io/redirect-notification'})
    res.end()
    })
}
export const getEmployeeDetailsFromLinkedin = (req, res) => {
    const body = req.body;
    candidateManager.getLinkedinEmployeeLoginDetails(body).then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data))
}

export const listResourcesOfProvider = (req, res) => {
    const body = req;
    candidateManager.listProviderResources(body).then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data))
}
export const modifyProviderCandidateDetails = (req, res) => {
    const body = req.body;
    candidateManager.updateProviderCandidateInfo(body).then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data))
}

export const providerCandidateDetails = (req, res) => {
    const body = req.query;
    candidateManager.getProviderCandidateResume(body).then((response: any) => sendResponse(res, response.code, 1, 201, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 401, error.message, error.data))
}

export const getHtmlResume = (req, res) => {
    var fs = require('fs');

    fs.readFile('./src/candidates/UploadHtml.html', function(err, data) {
        if (err) { 
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
        }
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write(data);
        return res.end();
    });
}

export const postHtmlResume = (req, res) => {
    const body = req.query;
    candidateManager.getHtmlResume(req,res);
}

export const updateProviderCandidateEllowRateController = (req, res) => {
    const body = req.body;
    candidateManager.addProviderCandidateEllowRate(body).then((response: any) => sendResponse(res, response.code, 1, 201, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 401, error.message, error.data))
}
export const approveProviderCandidates = (req, res) => {
    const body = req.body;
    candidateManager.approveProvidersCandidates(body).then((response: any) => sendResponse(res, response.code, 1, 201, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 401, error.message, error.data))
}
