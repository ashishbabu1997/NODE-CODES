import sendResponse from '../common/response/response';
export default (schema) => {
    return (req, res, next) => {
        console.log('Logged: validation')
        var body = (req.route.methods.hasOwnProperty("post") || req.route.methods.hasOwnProperty("put"))
            ? (body = req.body)
            : (body = req.query);

        const { error, value } = schema.validate(body);

        if (error) {
            console.log('Logged: validation error' + error)
            sendResponse(res, 400, 0, error.message, {})
        } else {
            next();
        }
    };
};