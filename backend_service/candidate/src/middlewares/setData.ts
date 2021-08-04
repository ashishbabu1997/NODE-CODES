export default () => {
  return (req, res, next) => {
    const hasCompanyIdProperty = Object.prototype.hasOwnProperty.call(req.user, 'companyId');
    const hasPost = Object.prototype.hasOwnProperty.call(req.route.methods, 'post');
    const hasPut = Object.prototype.hasOwnProperty.call(req.route.methods, 'put');
    const hasDelete = Object.prototype.hasOwnProperty.call(req.route.methods, 'delete');
    const hasGet = Object.prototype.hasOwnProperty.call(req.route.methods, 'get');

    if (hasCompanyIdProperty) {
      if (hasPost || hasPut) {
        req.body['companyId'] = req.user.companyId;
        req.body['employeeId'] = req.user.employeeId;
        req.body['userRoleId'] = req.user.userRoleId;
      } else if (hasGet || hasDelete) {
        req.query['companyId'] = req.user.companyId;
        req.query['employeeId'] = req.user.employeeId;
        req.query['userRoleId'] = req.user.userRoleId;
      }
    }
    next();
  };
};
