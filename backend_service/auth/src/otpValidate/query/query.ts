export default {
    validateOtp:"SELECT email FROM employee WHERE otp=$1 AND email=$2",
    storePassword:"UPDATE  employee SET password=$1 WHERE otp=$2"
};