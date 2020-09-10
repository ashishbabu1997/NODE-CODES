import {listStates} from './statesApi.manager';
import sendResponse from '../common/response/response';

export const getStatesList = (req, res) => {
    const body = req.query;
    listStates(body).then((response: any) => {
        sendResponse(res, response.code, 1,201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,401, error.message, error.data)
    })
}