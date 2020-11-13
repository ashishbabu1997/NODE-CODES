import employeeQuery from './query/employee.query';
import database from '../common/database/database';

export const getEmployeesByCompanyId = (_body) => {
    return new Promise((resolve, reject) => {
    
        var selectQuery = employeeQuery.getemployees;

        if(_body.filter)
        {
            selectQuery =selectQuery +  "AND (LOWER(firstname) LIKE '%" +_body.filter.toLowerCase() + "%' OR LOWER(lastname) LIKE '%" +  _body.filter.toLowerCase() + "%') "
        }
        const orderBy = {
            "firstName": 'first_name',
            "lastName": 'last_name',
            "roleId":'role_id',
            "email": 'email',
            "createdOn":'created_on'
        }

        if(_body.sortBy && _body.sortType && Object.keys(orderBy).includes(_body.sortBy))  
        {
            selectQuery = selectQuery + ' ORDER BY ' + orderBy[_body.sortBy] + ' ' + _body.sortType
        }

        if(_body.limit && _body.skip){
            selectQuery = selectQuery + ' LIMIT ' + _body.limit + ' OFFSET ' + _body.skip;
        }
    const query = {
            name: 'get-EmployeesByCompanyId',
            text: selectQuery,
            values: [parseInt(_body.companyId)],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Employees listed successfully", data: { Employees: results.rows } });
        })
    })
}

export const createEmployee = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'add-employee',
            text: employeeQuery.addEmploye,
            values: [_body.firstName, _body.lastName, _body.companyId, _body.email, _body.roleId, currentTime, _body.contactNumber,true,_body.document,3],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Employee added successfully", data: {} });
        })
    })
}
