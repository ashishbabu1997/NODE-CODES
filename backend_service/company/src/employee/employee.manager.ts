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
export const updateUser = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                if (_body.decisionValue==1)
                {
                    const employeeUpdate = {
                        name: 'update-employees',
                        text:employeeQuery.updateEmployee,
                        values:[_body.employeeId,_body.firstName,_body.lastName,_body.roleId,_body.phoneNumber]
                    }
                    await client.query(employeeUpdate);
                }
                else
                {
                    const employeeDelete = {
                        name: 'list-employees',
                        text:employeeQuery.deleteEmployee,
                        values:[_body.employeeId]
                    }
                    await client.query(employeeDelete);
                }
                await client.query('COMMIT');
                resolve({ code: 200, message: "Employees updated successfully", data:{} });
            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
            } finally {
                client.release();
            }
        })().catch(e => {
            console.log(e)
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
        })
    })
}
export const getUserDetails = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                    const employeeData = {
                        name: 'data-employees',
                        text:employeeQuery.getEmployeeData,
                        values:[_body.employeeId]
                    }
                    var result=await client.query(employeeData)
                await client.query('COMMIT');
                resolve({ code: 200, message: "Employees updated successfully", data:{employee:result.rows[0]} });
            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
            } finally {
                client.release();
            }
        })().catch(e => {
            console.log(e)
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
        })
    })
}