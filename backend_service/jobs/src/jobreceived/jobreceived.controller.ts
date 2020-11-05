import {getAllJobReceived, getJobReceivedByJobReceivedId,submitCandidateProfile, updateIsRejectForJobReceived, getProfileByCompanyId, saveCandidateProfile,editSkills} from './jobreceived.manager';
import sendResponse from '../common/response/response';

export const getJobReceived = (req, res) => {
    const body = req.query;
    getAllJobReceived(body).then((response: any) => {
        sendResponse(res, response.code, 1,200, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,400, error.message, error.data)
    })
}

export const getJobReceivedById = (req, res) => {
    const body = req.query;
    getJobReceivedByJobReceivedId(body).then((response: any) => {
        sendResponse(res, response.code, 1,200, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,400, error.message, error.data)
    })
}

export const updateReject = (req, res) => {
    const body = req.body;
    updateIsRejectForJobReceived(body).then((response: any) => {
        sendResponse(res, response.code, 1,202, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,402, error.message, error.data)
    })
}

export const addProfile = (req, res) => {
    const body = req.body;
    saveCandidateProfile(body).then((response: any) => {
        sendResponse(res, response.code, 1,201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,401, error.message, error.data)
    })
}

export const submitProfile = (req, res) => {
    const body = req.body;
    submitCandidateProfile(body).then((response: any) => {
        sendResponse(res, response.code, 1,202, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,402, error.message, error.data)
    })
}

export const getProfile = (req, res) => {
    const body = req.query;
    getProfileByCompanyId(body).then((response: any) => {
        sendResponse(res, response.code, 1,200, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,400, error.message, error.data)
    })
}
// export const editProfile = (req, res) => {
//     const body = req.body;
//     console.log("Hai")
//     editCandidateDetails(body).then((response: any) => {
//         console.log(response)
//         sendResponse(res, response.code, 1,202, response.message, response.data)
//     }).catch(error => {
//         sendResponse(res, error.code, 0,402, error.message, error.data)
//     })
// }
// export const editProfile = (req, res) => {
//     const body = req.body;
//     editCandidateDetails(body).then((response: any) => sendResponse(res, response.code, 1,202, response.message, response.data))
//         .catch((error: any) => sendResponse(res, error.code, 0,402, error.message, error.data))
// }
export const skillEdits = (req, res) => {
    const body = req.body;
    editSkills(body).then((response: any) => sendResponse(res, response.code, 1,202, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,402, error.message, error.data))
}