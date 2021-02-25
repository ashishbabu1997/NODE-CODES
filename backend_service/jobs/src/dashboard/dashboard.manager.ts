import database from '../common/database/database';
import * as queryService from '../queryService/queryService';
import * as utils from '../utils/utils';

// >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Get all values for counts in dashoboard
export const getCounts = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        (async () => {
            const client = await database()
            try {
                await client.query('BEGIN');
                let data = {};

                if(_body.userRoleId == 2)
                {
                    const hirerPositionCounts =  await client.query(queryService.hirerPositionCounts(_body))
                    const clientHiringCountsHirer =  await client.query(queryService.clientHiringCountsHirer(_body))
                    const clientHiringSideCountsHirer =  await client.query(queryService.clientHiringSideCountsHirer(_body))

                    data = {
                        positionCounts : hirerPositionCounts.rows[0],
                        clientScreening : clientHiringCountsHirer.rows,
                        clientScreeningSideCount : clientHiringSideCountsHirer.rows[0]
                    }
                }
                else if(_body.userRoleId == 1)
                {
                    const adminPositionCounts =  await client.query(queryService.adminPositionCounts(_body))
                    const clientHiringCountsAdmin =  await client.query(queryService.clientHiringCountsAdmin(_body))
                    const candidateVetted_NonVettedCount =  await client.query(queryService.candidateVetted_NonVettedCount(_body))
                    const ellowScreeningCount =  await client.query(queryService.ellowScreeningCount(_body))
                    const clientHiringSideCountsAdmin =  await client.query(queryService.clientHiringSideCountsAdmin(_body))

                    data = {
                        positionCounts : adminPositionCounts.rows[0],
                        clientScreening : clientHiringCountsAdmin.rows,
                        clientScreeningSideCount : clientHiringSideCountsAdmin.rows[0],
                        candidateCounts : candidateVetted_NonVettedCount.rows[0],
                        ellowScreening : ellowScreeningCount.rows
                    }
                }
             
                await client.query('COMMIT')
                resolve({ code: 200, message: "Dashboard listed succesfully",data });
            } catch (e) {
                await client.query('ROLLBACK')
                console.log(e)
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
            } 
        })().catch(e => {
            console.log(e)
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
        })
    })
}

// >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Get all upcoming interviews
export const getUpcomingInterviews = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        (async () => {
            const client = await database()
            try {
                await client.query('BEGIN');
                let data = {};

                if(_body.userRoleId == 1)
                {
                    const recruiterInterviewLists =  await client.query(queryService.upcomingInterviewsForEllowRecruiter(_body,utils.upcomingInterviewSort(_body)))
                    data = {
                        upcomingInterviews : recruiterInterviewLists.rows,
                    }
                }
                else 
                {
                    const hirerInterviewLists =  await client.query(queryService.upcomingInterviewsForHirer(_body,utils.upcomingInterviewSort(_body)))
                    data = {
                        upcomingInterviews : hirerInterviewLists.rows,
                    }
                }
             
                await client.query('COMMIT')
                resolve({ code: 200, message: "Dashboard listed succesfully",data });
            } catch (e) {
                await client.query('ROLLBACK')
                console.log(e)
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
            } 
        })().catch(e => {
            console.log(e)
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
        })
    })
}

// >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Get all active positions
export const getAllActivePositions = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        (async () => {
            const client = await database()
            try {
                await client.query('BEGIN');
                let data = {};

                if(_body.userRoleId == 1)
                {
                    const allPositionsList =  await client.query(queryService.getActivePositions(_body,utils.activePositionSort(_body)))
                    data = {
                        activePositions : allPositionsList.rows,
                    }
                }
                else  
                {
                    console.log(_body.companyId)
                    const hirerActivePositions =  await client.query(queryService.getHirerActivePositions(_body,utils.activePositionSort(_body)))
                    data = {
                        activePositions : hirerActivePositions.rows,
                    }
                }
             
                await client.query('COMMIT')
                resolve({ code: 200, message: "Dashboard listed succesfully",data });
            } catch (e) {
                await client.query('ROLLBACK')
                console.log(e)
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
            } 
        })().catch(e => {
            console.log(e)
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
        })
    })
}