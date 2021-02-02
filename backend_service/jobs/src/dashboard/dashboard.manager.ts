import database from '../common/database/database';
import * as queryService from '../queryService/queryService';

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

                    data = {
                        positionCounts : hirerPositionCounts.rows[0],
                        clientScreening : clientHiringCountsHirer.rows
                    }
                }
                else if(_body.userRoleId == 1)
                {
                    const adminPositionCounts =  await client.query(queryService.adminPositionCounts(_body))
                    const clientHiringCountsAdmin =  await client.query(queryService.clientHiringCountsAdmin(_body))
                    const candidateVetted_NonVettedCount =  await client.query(queryService.candidateVetted_NonVettedCount(_body))
                    const ellowScreeningCount =  await client.query(queryService.ellowScreeningCount(_body))

                    data = {
                        positionCounts : adminPositionCounts.rows[0],
                        clientScreening : clientHiringCountsAdmin.rows,
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
                    const recruiterInterviewLists =  await client.query(queryService.upcomingInterviewsForEllowRecruiter(_body))
                    data = {
                        upcomingInterviews : recruiterInterviewLists.rows,
                    }
                }
                else 
                {
                    const hirerInterviewLists =  await client.query(queryService.upcomingInterviewsForHirer(_body))
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