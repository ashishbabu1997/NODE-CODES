import sendResponse from '../common/response/response';
export default (schema) => {
  return (req, res, next) => {
    const hasPost = Object.prototype.hasOwnProperty.call(req.route.methods, 'post');
    const hasPut = Object.prototype.hasOwnProperty.call(req.route.methods, 'put');
    const body = (hasPost || hasPut) ?req.body :req.query;
    const {error} = schema.validate(body);

    if (error) {
      sendResponse(res, 400, 0, 405, error.message, {});
    } else {
      next();
    }
  };
};
