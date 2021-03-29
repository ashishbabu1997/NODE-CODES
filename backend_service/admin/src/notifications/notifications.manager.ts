import database from '../common/database/database';
import * as queryService from '../queryService/queryService';

// socket;

// FUNC. Notifications to the admin. 
export const getNotifications = (_body) => {
    return new Promise((resolve, reject) => {
        
        
        database().query(queryService.listNotifications(), (error, results) => {
            if (error) {
                reject({ code: 400, message: "Database Error", data: {} });
                return;
            }
            resolve({ code: 200, message: "Users listed successfully", data: { notifications: results.rows } });
        })
    })
}
