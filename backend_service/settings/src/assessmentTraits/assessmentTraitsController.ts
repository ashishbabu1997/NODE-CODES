import { getAssessmentTraits, createNewAssessmentTraits, updateAssessmentTraits,deleteAssessmentTraits } from './assessmentTraitsManager';
import sendResponse from '../common/response/response';

// Fetch the Assessment Traits
export const getAssessmentTrait = (req, res) => {
    getAssessmentTraits().then((response: any) => {
        sendResponse(res, response.code, 1,200, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,400, error.message, error.data)
    })
}

// Create new Assessment Traits
export const addAssessmentTrait = (req, res) => {
    createNewAssessmentTraits(req.body).then((response: any) => {
        sendResponse(res, response.code, 1,201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,401, error.message, error.data)
    })
}

// Update the Assessment Traits
export const updateAssessmentTrait = (req, res) => {
    updateAssessmentTraits(req.body).then((response: any) => {
        sendResponse(res, response.code, 1,202, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,402, error.message, error.data)
    })
}

// Delete the Assessment Traits
export const deleteAssessmentTrait = (req, res) => {
    deleteAssessmentTraits(req.params).then((response: any) => {
        sendResponse(res, response.code, 1,203, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,403, error.message, error.data)
    })
}