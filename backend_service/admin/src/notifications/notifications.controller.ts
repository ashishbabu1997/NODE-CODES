import { getNotifications} from './notifications.manager';
import sendResponse from '../common/response/response';
export const listNotifications = (req, res) => {
    const body = req.query;
    getNotifications(body).then((response: any) => sendResponse(res, response.code, 1,200, response.message, response.data))
        .catch((error: any) => sendResponse(res, error.code, 0,400, error.message, error.data))
}
