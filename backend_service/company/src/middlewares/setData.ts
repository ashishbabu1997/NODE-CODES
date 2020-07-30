export default () => {
    return (req, res, next) => {
        console.log(req.user.companyId)
        if (req.user.hasOwnProperty('companyId')) {
            if (req.route.methods.hasOwnProperty("post") || req.route.methods.hasOwnProperty("put")) {
                req.body['companyId'] = req.user.companyId;
                req.body['employeeId'] = req.user.employeeId;
            }
            else if (req.route.methods.hasOwnProperty("get") || req.route.methods.hasOwnProperty("delete")) {
                req.params['companyId'] = req.user.companyId;
                req.query['employeeId'] = req.user.employeeId;
            }
        }
        next();
    }
};
