import database from '../common/database/database';
import * as queryService from '../queryService/queryService';

// >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Get all values for filter for position page filter
export const getPositionFilter = (_body) => {
    return new Promise((resolve, reject) => {

        if(_body.userRoleId == 1)
        {
            const query = 'with filter as (select ARRAY(select distinct company_name from company c left join employee e on c.company_id = e.company_id where e.account_type = 1 and c.status = true and e.status = true order by company_name) as company, (select ARRAY(select distinct position_name from positions where status = true and job_status = 6 order by position_name)) as position, (select ARRAY(select json_build_object(\'employeeId\', employee_id, \'employeeName\', firstname) from employee where account_type = 3 and status = true)) as "allocatedList" ) select * from filter';
            database().query(query, (error, results) => {
                if (error) {
                    reject({ code: 400, message: "Failed. Please try again.", data: {} });
                    return;
                }
                resolve({ code: 200, message: "Filter values listed successfully", data: results.rows });
            })
        }
        
    })
}