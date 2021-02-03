import * as dashboardManager from './dashboard.manager';
import sendResponse from '../common/response/response';

export const getCounts = (req, res) => {
    const body = req.query;
    dashboardManager.getCounts(body).then((response: any) => {
        sendResponse(res, response.code, 1,200, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,400, error.message, error.data)
    })
}

export const fetchupcomingInterviews = (req, res) => {
    const body = req.query;
    dashboardManager.getUpcomingInterviews(body).then((response: any) => {
        sendResponse(res, response.code, 1,200, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,400, error.message, error.data)
    })
}
export const fetchAllActivePositions = (req, res) => {
    const body = req.query;
    dashboardManager.getAllActivePositions(body).then((response: any) => {
        sendResponse(res, response.code, 1,200, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,400, error.message, error.data)
    })
}
