export default (response, code, status, responseCode, message, data) => {
  response.status(code).json({
    status, responseCode, message, data,
  });
};
