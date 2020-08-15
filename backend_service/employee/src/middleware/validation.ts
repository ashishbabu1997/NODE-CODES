import sendResponse from '../common/response/response';
export default (schema) => {
    return (req, res, next) => {
        var body = (req.route.methods.hasOwnProperty("post") || req.route.methods.hasOwnProperty("put"))
            ? (body = req.body)
            : (body = req.query);

        const { error, value } = schema.validate(body);

        if (error) {
             sendResponse(res, 400, 0,405, error.message, {})
        } else {
            next();
        }
    };
};