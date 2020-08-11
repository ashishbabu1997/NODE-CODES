export default {
    insertEmailOtp:"INSERT INTO employee  (email,otp) VALUES ($1,$2)",
    checkEmail:"SELECT password from employee WHERE email=$1 AND password!='null'"
}