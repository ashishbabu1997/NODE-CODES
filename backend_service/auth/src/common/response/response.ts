export default class ResponseService {
        constructor() { }
    
        sendResponse = (response, code, status, message, data) => {
            response.status(code).json({
                status, message, data
            })
        }
    }