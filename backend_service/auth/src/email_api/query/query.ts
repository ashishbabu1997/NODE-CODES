export default {
    insertEmailOtp:"INSERT INTO employee  (email,otp) VALUES ($1,$2)",
    updateEmailOtp:"UPDATE employee SET email=$1,otp=$2 WHERE email=$1",
    checkStatus:"SELECT status from employee WHERE email=$1",
    checkEmail:"SELECT email from employee WHERE email=$1"
}