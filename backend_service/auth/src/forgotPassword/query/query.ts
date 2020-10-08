export default {
    insertToken:`UPDATE employee SET token=$2 WHERE email=$1 `,
    checkEmail:'SELECT password as "password",user_role_id as "userRoleId" from employee WHERE email=$1'
};