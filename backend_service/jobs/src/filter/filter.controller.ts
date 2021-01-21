import * as filterManager from './filter.manager';
import sendResponse from '../common/response/response';

export const getPositionFilter = (req, res) => {
    const body = req.query;
    filterManager.getPositionFilter(body).then((response: any) => {
        sendResponse(res, response.code, 1,200, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,400, error.message, error.data)
    })
}