export default {
    insertEmailOtp:"INSERT INTO employee  (email,otp,updated_on) VALUES ($1,$2,$3)",
    updateEmailOtp:"UPDATE employee SET email=$1,otp=$2,updated_on=$3 WHERE email=$1",
    checkStatus:"SELECT status from employee WHERE email=$1",
    checkEmail:"SELECT email from employee WHERE email=$1"
}