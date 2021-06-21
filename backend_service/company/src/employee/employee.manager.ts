import employeeQuery from './query/employee.query';
import database from '../common/database/database';
import * as queryService from '../queryService/queryService';
import * as utils from '../utils/utils';

export const getEmployeesByCompanyId = (_body) => {
    return new Promise((resolve, reject) => {

        var selectQuery = employeeQuery.getemployees;
        _body["userCompanyId"] = _body.userRoleId=='1'?_body["userCompanyId"]:_body.companyId;
        
         selectQuery += utils.employeeSort(_body)
         selectQuery += utils.pagination(_body)

        database().query(queryService.getEmployeeDetailsFromCompanyId(_body,selectQuery), (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: error.message });
                return;
            }
            resolve({ code: 200, message: "Employees listed successfully", data: { Employees: results.rows } });
        })
    })
}

export const createEmployee = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        let contactNumber = _body.contactNumber = null ? '' : _body.contactNumber
        _body["userCompanyId"] = _body.userRoleId==1?_body["userCompanyId"]:_body.companyId;

        const query = {
            name: 'add-employee',
            text: employeeQuery.addEmploye,
            values: [_body.firstName, _body.lastName, _body.userCompanyId, _body.email, _body.roleId, currentTime, contactNumber, true, _body.document, 3],
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
                let contactNumber = _body.phoneNumber = null ? '' : _body.phoneNumber
                if (_body.decisionValue == 1) {
                    const employeeUpdate = {
                        name: 'update-employees',
                        text: employeeQuery.updateEmployee,
                        values: [_body.empId, _body.firstName, _body.lastName, _body.roleId, contactNumber]
                    }
                    await client.query(employeeUpdate);
                }
                else {
                    const employeeDelete = {
                        name: 'list-employees',
                        text: employeeQuery.deleteEmployee,
                        values: [_body.empId]
                    }
                    await client.query(employeeDelete);
                }
                await client.query('COMMIT');
                resolve({ code: 200, message: "Employees updated successfully", data: {} });
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
                    text: employeeQuery.getEmployeeData,
                    values: [_body.empId]
                }
                var result = await client.query(employeeData)
                await client.query('COMMIT');
                resolve({ code: 200, message: "Employees updated successfully", data: { employee: result.rows[0] } });
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


// >>>>>>> FUNC. >>>>>>>
//>>>>>>>>>>>>>>>>>>Function used to set a user active or inactive
export const toggleEmployeeActiveStatus = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now());
        (async () => {
            const client = await database()
            var companyId = '';
            try {
                await client.query('BEGIN');

                if (_body.userRoleId == 1)
                    companyId = _body.userCompanyId
                else
                    companyId = _body.companyId

                var result = await client.query(queryService.getCompanyIdFromEmployeeId(_body));

                if (result.rows && result.rows[0].company_id == companyId)
                    await client.query(queryService.updateActiveState(_body));
                else
                    reject({ code: 400, message: "Access Denied", data: "Unauthorised access detected, please try again later" });

                resolve({ code: 200, message: "Active status updated successfully", data: {} });
                await client.query('COMMIT')
            } catch (e) {
                console.log("Error e1: ", e);
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            }
        })().catch(e => {
            console.log("Error e2: ", e);
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })

    })
}

// >>>>>>> FUNC. >>>>>>>
//>>>>>>>>>>>>>>>>>>Function used to set a user as primary cntact of that company
export const setAsPrimaryContact = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now());
        (async () => {
            const client = await database()
            var companyId = '';
            try {
                await client.query('BEGIN');

                if (_body.userRoleId == 1)
                    companyId = _body.userCompanyId
                else
                    companyId = _body.companyId

                var result = await client.query(queryService.getCompanyIdFromEmployeeId(_body));

                if (result.rows && result.rows[0].company_id == companyId)
                    await client.query(queryService.updatePrimaryContact(_body));
                else
                    reject({ code: 400, message: "Access Denied", data: "Unauthorised access detected, please try again later" });

                resolve({ code: 200, message: "Primary contact update succesfully", data: {} });
                await client.query('COMMIT')
            } catch (e) {
                console.log("Error e1: ", e);
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            }
        })().catch(e => {
            console.log("Error e2: ", e);
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })

    })
}