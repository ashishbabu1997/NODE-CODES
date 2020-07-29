import { getTechnologyAreas, createNewTechnologyArea, updateTechnologyAreaType,deleteTechnologyAreaType } from './TechnologyAreaManager';
import sendResponse from '../common/response/response';

// Fetch the technology areas
export const getTechnologyAreaTypes = (req, res) => {
    getTechnologyAreas().then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

// Create new technology area
export const addTechnologyArea = (req, res) => {
    createNewTechnologyArea(req.body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

// Update the technology area
export const updateTechnologyArea = (req, res) => {
    updateTechnologyAreaType(req.body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

// Delete the technology area
export const deleteTechnologyArea = (req, res) => {
    deleteTechnologyAreaType(req.params).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}