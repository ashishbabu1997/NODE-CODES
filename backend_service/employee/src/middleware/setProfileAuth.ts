import sendResponse from '../common/response/response';

// profiles is an array which contains integer 1 to 4.
// 1 - Admin/Ellow Recuiter, 2 - Hirer, 3 - Provider, 4 - Freelancer
export default (profiles) => {
    return (req, res, next) => {
        if (req.user.hasOwnProperty('companyId')) {
            if (req.route.methods.hasOwnProperty("post") || req.route.methods.hasOwnProperty("put")) {
                let roleId = parseInt(req.body['userRoleId']);
                if(!profiles.includes(roleId)) 
                return sendResponse(res, 403, 0, 401, 'Unauthorised Access','Access not permitted to this API');
            }
            else if (req.route.methods.hasOwnProperty("get") || req.route.methods.hasOwnProperty("delete")) {
                let roleId = parseInt(req.query['userRoleId']);
                if(!profiles.includes(roleId)) 
                return sendResponse(res, 403, 0, 401, 'Unauthorised Access','Access not permitted to this API');
            }
        }
        next();
    }
};
