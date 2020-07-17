import {createEmployee, createCompany } from './employee.manager';
import sendResponse from './common/response/response';


export const create = async (req, res) => {
  console.log('Logged: controller company');
  let company = await createCompany(req.body).catch(sendResponse.bind(this, res));
  if(typeof company === "undefined") return;

  await createEmployee(req.body,company).then((response: any) => {
    console.log('Logged: controller error' + req.body);
    sendResponse(res, response.code, 1, response.message, response.data)})
    .catch(error => {
      sendResponse(res, error.code, 0, error.message, error.data);
    })
  }
