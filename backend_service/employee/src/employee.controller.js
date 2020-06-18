let employeeManager = require('./employee.manager');
let responseManager = require.main.require('./common/response/response');

async function create(request, response, next) {

  let validationRes = await employeeManager.validate(request.body).catch(responseManager.catchError.bind(this, response));
  if (validationRes !== true) return;

  let company = await employeeManager.createCompany(request.body)
    .catch(responseManager.catchError.bind(this, response));

  let message = 'Employee created successfully';
  await employeeManager.createEmployee(request.body, company.pk_id).then(responseManager.sendResponse.bind(this, response, message))
    .catch(responseManager.catchError.bind(this, response));
}

module.exports = create;