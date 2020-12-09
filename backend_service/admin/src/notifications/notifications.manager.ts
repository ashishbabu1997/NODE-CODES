import notificationsQuery from './query/notifications.query';
import database from '../common/database/database';

// FUNC. Notifications to the admin. 
export const getNotifications = (_body) => {
    return new Promise((resolve, reject) => {
        const listquery = {
            name: 'list-notifications',
            text: notificationsQuery.listNotifications
        }
        database().query(listquery, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Database Error", data: {} });
                return;
            }
            resolve({ code: 200, message: "Users listed successfully", data: { notifications: results.rows } });
        })
    })
}
