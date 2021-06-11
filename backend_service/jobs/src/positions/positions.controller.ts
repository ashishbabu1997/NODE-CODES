import * as positionManager from './positions.manager';
import sendResponse from '../common/response/response';

export const getPositions = (req, res) => {
    const body = req;
    positionManager.getCompanyPositions(body).then((response: any) => {
        sendResponse(res, response.code, 1,200, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,400, error.message, error.data)
    })
}

export const createPositions = (req, res) => {
    const body = req.body;
    positionManager.createCompanyPositions(body).then((response: any) => {
        sendResponse(res, response.code, 1,201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,401, error.message, error.data)
    })
}

export const getPositionDetails = (req, res) => {
    const body = req.params;
    positionManager.fetchPositionDetails(body).then((response: any) => {
        sendResponse(res, response.code, 1,200, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,400, error.message, error.data)
    })
}

export const updatePositions = (req, res) => {
    const body = req.body;
    positionManager.updateCompanyPositions(body).then((response: any) => {
        sendResponse(res, response.code, 1,202, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,402, error.message, error.data)
    })
}

export const publishPositions = (req, res) => {
    const body = req.body;
    positionManager.publishCompanyPositions(body).then((response: any) => {
        sendResponse(res, response.code, 1,201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,401, error.message, error.data)
    })
}
export const changePositionStatus = (req, res) => {
    const body = req.body;
    positionManager.changeJobStatus(body).then((response: any) => {
        sendResponse(res, response.code, 1,201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,401, error.message, error.data)
    })
}
export const positionDeletion = (req, res) => {    
    const body = req.body;
    positionManager.deletePositions(body).then((response: any) => sendResponse(res, response.code, 1,201, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,401, error.message, error.data))
}

export const getCompanyNames = (req, res) => {
    const body = req.query;
    positionManager.getCompanies(body).then((response: any) => {
        sendResponse(res, response.code, 1,201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,401, error.message, error.data)
    })
}

export const updateReadStatus = (req, res) => {
    const body = req.body;
    positionManager.changeReadStatus(body).then((response: any) => {
        sendResponse(res, response.code, 1,201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,401, error.message, error.data)
    })

}

export const resetReadStatusAsNew = (req, res) => {
    const body = req.body;
    positionManager.resetReadStatus(body).then((response: any) => {
        sendResponse(res, response.code, 1,201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,401, error.message, error.data)
    })

}


export const updateAllocatedTo = (req, res) => {
    const body = req.body;
    positionManager.updateAllocatedTo(body).then((response: any) => {
        sendResponse(res, response.code, 1,201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,401, error.message, error.data)
    })

}

