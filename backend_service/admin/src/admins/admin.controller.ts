import * as adminManager from './admin.manager';
import sendResponse from '../common/response/response';
export const listUsers = (req, res) => {
  const body = req;
  adminManager
    .listUsersDetails(body)
    .then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data));
};

export const registeredUserList = (req, res) => {
  const body = req;
  adminManager
    .allUsersList(body)
    .then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data));
};

export const userDetails = (req, res) => {
  const body = req.query;
  adminManager
    .getUserDetails(body)
    .then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data));
};
export const adminPanel = (req, res) => {
  const body = req.body;
  adminManager
    .clearance(body)
    .then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data));
};

export const addJobCategory = (req, res) => {
  const body = req.body;
  adminManager
    .addJobCategory(body)
    .then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data));
};

export const addSkills = (req, res) => {
  const body = req.body;
  adminManager
    .addSkills(body)
    .then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data));
};
export const editJobCategory = (req, res) => {
  const body = req.body;
  adminManager
    .editJobCategory(body)
    .then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data));
};

export const deleteJobCategory = (req, res) => {
  const body = req.body;
  adminManager
    .deleteJobCategory(body)
    .then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data));
};

export const removeSkillsFromJobCategory = (req, res) => {
  const body = req.body;
  adminManager
    .removeSkillsFromJobCategory(body)
    .then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data));
};

export const editSkill = (req, res) => {
  const body = req.body;
  adminManager
    .editSkill(body)
    .then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data));
};

export const removeSkills = (req, res) => {
  const body = req.body;
  adminManager
    .removeSkills(body)
    .then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data));
};

export const extractSkillsFromExcel = (req, res) => {
  const body = req.files;
  adminManager
    .extractSkillsFromExcel(body)
    .then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data));
};

export const allSkills = (req, res) => {
  const body = req.query;
  adminManager
    .allSkills(body)
    .then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data));
};

export const reports = (req, res) => {
  const body = req.query;
  adminManager
    .reports(body)
    .then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data));
};

export const deleteResource = (req, res) => {
  const body = req.body;
  adminManager
    .deleteResource(body)
    .then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data));
};


export const reportsSummaryController = (req, res) => {
  const body = req.query;
  adminManager
    .reportsSummary(body)
    .then((response: any) => sendResponse(res, response.code, 1, 200, response.message, response.data))
    .catch((error: any) => sendResponse(res, error.code, 0, 400, error.message, error.data));
};

