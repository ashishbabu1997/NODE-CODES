import { getCompanySkills, createNewSkills, updateComppanySkills, deleteCompanySkills } from './SkillsManager';
import sendResponse from '../common/response/response';

// Fetch the skills
export const getSkills = (req, res) => {
    getCompanySkills().then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

// Create new skills
export const addSkills = (req, res) => {
    createNewSkills(req.body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

// Update the skills
export const updateSkills = (req, res) => {
    updateComppanySkills(req.body).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}

// Delete the skills
export const deleteSkills = (req, res) => {
    deleteCompanySkills(req.params).then((response: any) => {
        sendResponse(res, response.code, 1, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0, error.message, error.data)
    })
}