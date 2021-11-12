import database from '../common/database/database';
import sendResponse from '../common/response/response';

export default () => {
  return (req, res, next) => {
    let body;
    req.route.methods.hasOwnProperty('post') || req.route.methods.hasOwnProperty('put') ? (body = req.body) : (body = req.query);
    const employeeId = body.employeeId;
    const query = `Select user_role_id as "userRoleId" from employee where employee_id = ${employeeId} and status = true`;
    database().query(query, (error, results) => {
      if (error) {
        sendResponse(res, 400, 0, 401, error.message, {});
        return;
      }
      if (results.rows.length == 0) {
        sendResponse(res, 400, 0, 401, 'Invalid user', {});
        return;
      } else {
        const userRoleId = results.rows[0].userRoleId;
        body.userRoleId = userRoleId;
        next();
      }
    });
  };
};
