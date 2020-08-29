export default {
    insertToken:`UPDATE employee SET token=$2 WHERE email=$1 `,
    checkEmail:'SELECT password from employee WHERE email=$1'
};