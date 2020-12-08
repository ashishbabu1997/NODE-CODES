import notificationsQuery from './notifications.query';
import database from '../database/database';


export const createNotification = async (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                const changePositionStatusQuery = {
                    name: 'create-notification',
                    text: notificationsQuery.createNotification,
                    values: [ _body.message, _body.companyId, _body.notificationType, currentTime,_body.userRoleId]
                }
                await client.query(changePositionStatusQuery);
                await client.query('COMMIT');
                resolve({ code: 200, message: "Notifiaction added successfully", data: {} });
            } catch (e) {
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
            } finally {
                client.release();
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
        })
    })
}