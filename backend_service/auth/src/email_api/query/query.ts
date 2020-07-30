export default {
    insertEmailOtp:"INSERT INTO employee  (email,otp) VALUES ($1,$2)",
    checkEmail:"SELECT * from employee WHERE email=$1"
}