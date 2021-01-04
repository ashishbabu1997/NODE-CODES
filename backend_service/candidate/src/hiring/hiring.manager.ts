import * as queryService from '../queryService/queryService';
import database from '../common/database/database';


export const getPositionHiringSteps = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                var result=await client.query(queryService.positionHiringStepsQuery(_body));
                resolve({ code: 200, message: "Position hiring steps listed successfully", data: result.rows  });
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

export const getCandidateHiringSteps = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                var result=await client.query(queryService.candidateHiringStepsQuery(_body));
                resolve({ code: 200, message: "Candidate client hiring steps listed successfully", data: result.rows  });
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

export const getDefaultHiringSteps = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                var result=await client.query(queryService.getDefaultHiringStepsQuery());
                resolve({ code: 200, message: "Default client  hiring steps listed successfully", data: result.rows });
            } catch (e) {
                console.log("Error raised from try : ",e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            }
        })().catch(e => {
            console.log("Error raised from async : ",e)
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}


export const updateHiringStepDetails = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                if([undefined,null,''].includes(_body.assignedTo))
                {
                    reject({ code: 400, message: "Candidate must be assigned to an assignee", data: {} });
                }
                else
                {
                    var result=await client.query(queryService.updateHiringStepDetailsQuery(_body));
                    resolve({ code: 200, message: "Hiring step details updated successfully", data: {} });
                }
            } catch (e) {
                console.log("Error raised from try : ",e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            }
        })().catch(e => {
            console.log("Error raised from async : ",e)
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}

export const moveCandidateHiringStep = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                await client.query(queryService.moveCandidateHiringStepQuery(_body)); 
                await client.query(queryService.updateCurrentStage(_body)); 

                resolve({ code: 200, message: "Hiring step moved successfully", data: {} });
            } catch (e) {
                console.log("Error raised from try : ",e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            }
        })().catch(e => {
            console.log("Error raised from async : ",e)
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}

export const rejectFromHiringProcess = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {

                _body.hiringStepName = 'Rejected';
                await client.query(queryService.rejectFromHiringProcess(_body));
                await client.query(queryService.updateCurrentStage(_body)); 

                resolve({ code: 200, message: "Rejected candidate succesfully", data: {} });
            } catch (e) {
                console.log("Error raised from try : ",e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            }
        })().catch(e => {
            console.log("Error raised from async : ",e)
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}

export const addNewStageForCandidate = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                await client.query(queryService.addNewStageForCandidate(_body));

                resolve({ code: 200, message: "Added new stage succesfully", data: {} });
            } catch (e) {
                console.log("Error raised from try : ",e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            }
        })().catch(e => {
            console.log("Error raised from async : ",e)
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })
    })
}

