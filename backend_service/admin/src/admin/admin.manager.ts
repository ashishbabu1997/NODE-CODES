import admineQuery from './query/admin.query';
import database from '../common/database/database';
import {Promise} from "es6-promise";
export const listUsersDetails = (_body) => {
    return new Promise((resolve, reject) => {
            var selectQuery = admineQuery.listUsers;
            if(_body.filter)
            {
                 selectQuery =selectQuery +" "+"AND LOWER(p.company_name) LIKE '%" +_body.filter.toLowerCase() +"%'"
            }
            const listquery = {
                name: 'list-candidates',
                text:selectQuery,
                values:[]
            }
            database().query(listquery, (error, results) => {
                if (error) {
                    console.log(error, "eror")
                    reject({ code: 400, message: "Database Error", data: {} });
                    return;
                }
                resolve({ code: 200, message: "Users listed successfully", data: { Users: results.rows } });
            })
        })
    }
