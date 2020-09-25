export default {
    addPassword:`UPDATE employee SET password=$2 WHERE email=$1`,
    checkPassword:'SELECT employee_id FROM employee WHERE email=$1 AND password=$2'
};