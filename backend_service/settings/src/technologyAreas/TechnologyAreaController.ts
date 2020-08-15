import { getTechnologyAreas, createNewTechnologyArea, updateTechnologyAreaType,deleteTechnologyAreaType } from './TechnologyAreaManager';
import sendResponse from '../common/response/response';

// Fetch the technology areas
export const getTechnologyAreaTypes = (req, res) => {
    getTechnologyAreas().then((response: any) => {
        sendResponse(res, response.code, 1,200, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,400, error.message, error.data)
    })
}

// Create new technology area
export const addTechnologyArea = (req, res) => {
    createNewTechnologyArea(req.body).then((response: any) => {
        sendResponse(res, response.code, 1,201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,401, error.message, error.data)
    })
}

// Update the technology area
export const updateTechnologyArea = (req, res) => {
    updateTechnologyAreaType(req.body).then((response: any) => {
        sendResponse(res, response.code, 1,202, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,402, error.message, error.data)
    })
}

// Delete the technology area
export const deleteTechnologyArea = (req, res) => {
    deleteTechnologyAreaType(req.params).then((response: any) => {
        sendResponse(res, response.code, 1,203, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,403, error.message, error.data)
    })
}