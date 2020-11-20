import * as queryService from '../queryService/queryService';
import database from '../common/database/database';
import { sendMail } from '../middlewares/mailer'
import config from '../config/config';
import { createNotification } from '../common/notifications/notifications';


export const modifyGeneralInfo = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                await client.query(queryService.modifyCandidateProfileDetailsQuery(_body));
                await client.query(queryService.modifyCandidateAvailabilityQuery(_body));
                await client.query(queryService.addWorkExperiences(_body));

                resolve({ code: 200, message: "Freelancer General info updated successfully", data: {} });
            } catch (e) {
                console.log("Error raised from try : ",e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            } finally {
                client.release();
            }
        })().catch(e => {
            console.log("Error raised from async : ",e)
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}

export const modifyOtherInfoAndSubmit = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');


                _body.idSet = Array.isArray(_body.cloudProficiency)?_body.cloudProficiency.map(a => a.cloudProficiencyId).filter(Number):false;
                if(_body.idSet)
                {
                    await client.query(queryService.deleteCandidateCloudQuery(_body));
                    await client.query(queryService.insertCandidateCloudQuery(_body));
                }
        
                await client.query(queryService.addDefaultTraits(_body));
                await client.query(queryService.addSkillRelatedTraits(_body));
                await client.query(queryService.modifySocialProfileAndStatusUpdate(_body));

                await client.query('COMMIT');

                resolve({ code: 200, message: "Freelancer other info updated and submitted successfully", data: {} });
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