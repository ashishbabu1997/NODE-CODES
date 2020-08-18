export default {
    validateOtp:`SELECT email,employee_id AS "employeeId",updated_on FROM employee WHERE otp=$1 AND email=$2`
};