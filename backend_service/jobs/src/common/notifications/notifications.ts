import notificationsQuery from './notifications.query';
import database from '../database/database';


export const createNotification = async (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now());
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                const changePositionStatusQuery = {
                    name: 'create-notification',
                    text: notificationsQuery.createNotification,
                    values: [_body.positionId, _body.candidateId, _body.message, _body.companyId, _body.notificationType,currentTime,_body.userRoleId,_body.employeeId]
                }
                await client.query(changePositionStatusQuery);
                await client.query('COMMIT');
                resolve({ code: 200, message: "Notifiaction added successfully", data: {} });
            } catch (e) {
                console.log("Error1",e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
            } finally {
                client.release();
            }
        })().catch(e => {
            console.log("Error2",e)
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
        })
    })
}







export const createHirerNotifications = async (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now());
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                const createHirerNotificationsQuery = {
                    name: 'create-hirer-notification',
                    text: notificationsQuery.createHirerNotification,
                    values: [_body.positionId, _body.candidateId, _body.message, _body.companyId, _body.notificationType, currentTime,_body.userRoleId,_body.employeeId]
                }
                await client.query(createHirerNotificationsQuery);
                await client.query('COMMIT');
                resolve({ code: 200, message: "Notifiaction added successfully", data: {} });
            } catch (e) {
                console.log("Error1",e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
            } finally {
                client.release();
            }
        })().catch(e => {
            console.log("Error2",e)
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
        })
    })
}