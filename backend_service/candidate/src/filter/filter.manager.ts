import * as queryService from '../queryService/queryService';
import database from '../common/database/database';
import * as emailClient from '../emailService/emailService';
import config from '../config/config'
import { createNotification } from '../common/notifications/notifications';
import filterQuery from './query/filter.query';



export const getCandidateFilters = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                await client.query('BEGIN');
                let companyResult = await client.query(queryService.getCompanyNames);
                let nameResult = await client.query(queryService.getfullNameAdmin);
                let positionResult = await client.query(queryService.getPositionsAdmin);


                await client.query('COMMIT');
                resolve({ code: 200, message: "Candidate filters listed successfully", data: {} });
            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            } finally {
                client.release();
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}



