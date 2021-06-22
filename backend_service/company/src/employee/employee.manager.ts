import employeeQuery from './query/employee.query';
import database from '../common/database/database';
import * as queryService from '../queryService/queryService';
import * as utils from '../utils/utils';
import * as emailService from '../emailService/employeeEmails';

export const getEmployeesByCompanyId = (_body) => {
    return new Promise((resolve, reject) => {

        var selectQuery = employeeQuery.getemployees;
        _body["userCompanyId"] = _body.userRoleId == '1' ? _body["userCompanyId"] : _body.companyId;

        selectQuery += utils.employeeSort(_body)
        selectQuery += utils.pagination(_body)

        database().query(queryService.getEmployeeDetailsFromCompanyId(_body, selectQuery), (error, results) => {
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
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                _body["userCompanyId"] = _body.userRoleId == 1 ? _body["userCompanyId"] : _body.companyId;
                var companyResults=await client.query(queryService.getCompanyProfile(_body));
                var companyDomain=companyResults.rows[0].domain
                if(utils.domainExtractor(_body.email) == companyDomain)
                {
                    _body.companyName=companyResults.rows[0].name
                    await client.query(queryService.addEmploye(_body));
                    emailService.addSubUserEmail(_body,client);

                }
                else{
                    reject({ code: 400, message: "Email address does'nt belong to your company domain.", data: {} });

                }

                await client.query('COMMIT');
                resolve({ code: 200, message: "Employee added successfully", data: {} });
            } catch (e) {
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            } finally {
                client.release();
            }
        })().catch(e => {
            console.log(e)
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
        })
    })
}

export const updateUser = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                await client.query(queryService.updateEmployee(_body));

                await client.query('COMMIT');
                resolve({ code: 200, message: "Employee details updated successfully", data: {} });
            } catch (e) {
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
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
        (async () => {
            const client = await database().connect()
            try {
                var result = await client.query(queryService.getEmployeeData(_body))

                resolve({ code: 200, message: "Employees data retrieved successfully", data: { employee: result.rows[0] } });
            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
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
                _body["userCompanyId"] = _body.userRoleId == 1 ? _body["userCompanyId"] : _body.companyId;

                var result = await client.query(queryService.getCompanyIdFromEmployeeId(_body));

                if (result.rows && result.rows[0].company_id == _body["userCompanyId"])
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
            try {
                await client.query('BEGIN');

                _body["userCompanyId"] = _body.userRoleId == 1 ? _body["userCompanyId"] : _body.companyId;

                var result = await client.query(queryService.getCompanyIdFromEmployeeId(_body));

                if (result.rows && result.rows[0].company_id == _body["userCompanyId"])
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