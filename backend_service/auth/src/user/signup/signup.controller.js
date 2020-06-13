let signupManager = require('./signup.manager');
let responseManager = require.main.require('./common/response/response');

async function signup(request, response, next) {

  let validationRes = await signupManager.validate(request.body).catch(responseManager.catchError.bind(this, response));
  if (validationRes !== true) return;

  let validateCompanySizeRes = await signupManager.validateCompanySize(request.body).catch(responseManager.catchError.bind(this, response));
    if (validateCompanySizeRes !== true) return;

  let validateRoleRes = await signupManager.validateRole(request.body).catch(responseManager.catchError.bind(this, response));
  if (validateRoleRes !== true) return;

  let company = await signupManager.insertCompany(request.body)
    .catch(responseManager.catchError.bind(this, response));
  
    await signupManager.insertEmployee(request.body,company.pk_id).then(responseManager.sendResponse.bind(this, response))
    .catch(responseManager.catchError.bind(this, response));
}

module.exports = signup;