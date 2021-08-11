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

                switch (_body.userRoleId) {
                    case '1':
                        const adminPositionCounts = await client.query(queryService.adminPositionCounts(_body))
                        const clientHiringCountsAdmin = await client.query(queryService.clientHiringCountsAdmin(_body))
                        const candidateVetted_NonVettedCount = await client.query(queryService.candidateVetted_NonVettedCount(_body))
                        const ellowScreeningCount = await client.query(queryService.ellowScreeningCount(_body))
                        const clientHiringSideCountsAdmin = await client.query(queryService.clientHiringSideCountsAdmin(_body))

                        data = {
                            positionCounts: adminPositionCounts.rows[0],
                            clientScreening: clientHiringCountsAdmin.rows,
                            clientScreeningSideCount: clientHiringSideCountsAdmin.rows[0],
                            candidateCounts: candidateVetted_NonVettedCount.rows[0],
                            ellowScreening: ellowScreeningCount.rows
                        }
                        break;
                    case '2':
                        const hirerPositionCounts = await client.query(queryService.hirerPositionCounts(_body))
                        const clientHiringCountsHirer = await client.query(queryService.clientHiringCountsHirer(_body))
                        const clientHiringSideCountsHirer = await client.query(queryService.clientHiringSideCountsHirer(_body))
    
                        data = {
                            positionCounts: hirerPositionCounts.rows[0],
                            clientScreening: clientHiringCountsHirer.rows,
                            clientScreeningSideCount: clientHiringSideCountsHirer.rows[0]
                        }
                        break;
                    case '3':
                        const clientHiringCountsProvider = await client.query(queryService.clientHiringCountsProvider(_body))
                        const clientHiringSideCountsProvider = await client.query(queryService.clientHiringSideCountsProvider(_body))
                        const ellowScreeningProviderCount = await client.query(queryService.ellowScreeningCountProvider(_body))

                        data = {
                            ellowScreeningCount: ellowScreeningProviderCount.rows,
                            clientScreening: clientHiringCountsProvider.rows,
                            clientScreeningSideCount: clientHiringSideCountsProvider.rows[0]
                        }
                        break;

                    case '1000':
                        const hirerProviderCounts = await client.query(queryService.hirerProviderCountsQuery(_body))
                        data = {
                            positionCounts: adminPositionCounts.rows[0],
                            clientScreening: clientHiringCountsAdmin.rows,
                            clientScreeningSideCount: clientHiringSideCountsAdmin.rows[0],
                            candidateCounts: candidateVetted_NonVettedCount.rows[0],
                            ellowScreening: ellowScreeningCount.rows,
                            hirerCount:hirerProviderCounts.rows[0].hirerCount,
                            providerCount:hirerProviderCounts.rows[0].providerCount

                        }
                    default:
                        break;
                }

                await client.query('COMMIT')
                resolve({ code: 200, message: "Dashboard listed succesfully", data });
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
        (async () => {
            const client = await database()
            try {
                await client.query('BEGIN');
                let interviewLists = null;

                switch (_body.userRoleId) {
                    case '1':
                        interviewLists = await client.query(queryService.upcomingInterviewsForEllowRecruiter(_body, utils.upcomingInterviewSort(_body)));
                        break;
                    case '2':
                        interviewLists = await client.query(queryService.upcomingInterviewsForHirer(_body, utils.upcomingInterviewSort(_body)));
                        break;
                    case '3':
                        interviewLists = await client.query(queryService.upcomingInterviewsForProvider(_body, utils.upcomingInterviewSort(_body)));
                        break;
                    default:
                        interviewLists['rows'] = null;
                        break;
                }
                
                await client.query('COMMIT')
                resolve({ code: 200, message: "Dashboard listed succesfully", data: interviewLists['rows'] });
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

                if (_body.userRoleId == 1) {
                    const allPositionsList = await client.query(queryService.getActivePositions(_body, utils.activePositionSort(_body)))
                    data = {
                        activePositions: allPositionsList.rows,
                    }
                }
                else {
                    console.log(_body.companyId)
                    const hirerActivePositions = await client.query(queryService.getHirerActivePositions(_body, utils.activePositionSort(_body)))
                    data = {
                        activePositions: hirerActivePositions.rows,
                    }
                }

                await client.query('COMMIT')
                resolve({ code: 200, message: "Dashboard listed succesfully", data });
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