import sendResponse from '../common/response/response';

// profiles is an array which contains integer 1 to 4.
// 1 - Admin/Ellow Recuiter, 2 - Hirer, 3 - Provider, 4 - Freelancer
export default (profiles) => {
  return (req, res, next) => {
    const hasCompanyIdProperty = Object.prototype.hasOwnProperty.call(req.user, 'companyId');
    const hasPost = Object.prototype.hasOwnProperty.call(req.route.methods, 'post');
    const hasPut = Object.prototype.hasOwnProperty.call(req.route.methods, 'put');
    const hasDelete = Object.prototype.hasOwnProperty.call(req.route.methods, 'delete');
    const hasGet = Object.prototype.hasOwnProperty.call(req.route.methods, 'get');

    if (hasCompanyIdProperty) {
      if (hasPost || hasPut) {
        const roleId = parseInt(req.body['userRoleId']);
        if (!profiles.includes(roleId)) {
          return sendResponse(res, 403, 0, 401, 'Unauthorised Access', 'Access not permitted to this API');
        }
      } else if (hasGet || hasDelete) {
        const roleId = parseInt(req.query['userRoleId']);
        if (!profiles.includes(roleId)) {
          return sendResponse(res, 403, 0, 401, 'Unauthorised Access', 'Access not permitted to this API');
        }
      }
    }
    next();
  };
};
