export default (response, code, status, message, data) => {
    response.status(code).json({
        status, message, data
    })
}
