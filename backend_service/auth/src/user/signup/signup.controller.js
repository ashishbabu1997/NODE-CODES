let signupManager = require('./signup.manager');
let responseManager = require.main.require('./common/response/response');

async function signup(request, response, next) {
  let message = 'Signup successfully';
  await signupManager.signup(request.body).then(responseManager.sendResponse.bind(this, response, message))
    .catch(responseManager.catchError.bind(this, response));
}

module.exports = signup;