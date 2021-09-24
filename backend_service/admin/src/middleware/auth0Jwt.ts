import jwt_decode from 'jwt-decode';
import sendResponse from '../common/response/response';

export const checkJwt = () => {
  return (req, res, next) => {
    try {
      let accessToken = req.headers.authorization;
      var decoded = jwt_decode(accessToken);
      if (decoded['azp'] !== 'kT9pCAOnQeH8e4OkwfYV11PPoLUAAN8A') return sendResponse(res, 403, 0, 401, 'Unauthorised Access', 'Access not permitted to this API');
    } catch (error) {
      return sendResponse(res, 403, 0, 401, 'Unauthorised Access', 'Invalid token');
    }
    next();
  };
};
