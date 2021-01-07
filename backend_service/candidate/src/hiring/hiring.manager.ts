import * as queryService from '../queryService/queryService';
import database from '../common/database/database';
import hiringQuery from './query/hiring.query';


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
                var candidatePositionResult=await client.query(queryService.candidateCurrentStageQuery(_body));                
                resolve({ code: 200, message: "Candidate client hiring steps listed successfully", data: {hiringSteps:result.rows,commonData : candidatePositionResult.rows[0] } });
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

export const getAllCandidateHiringSteps = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                var result=await client.query(queryService.candidateAllPositionHiringStepsQuery(_body));
                resolve({ code: 200, message: "Candidate client hiring steps for all positions listed successfully", data: result.rows });
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
                    reject({ code: 400, message: "There should be assignee for adding hiring steps", data: {} });
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
                if([undefined,null,''].includes(_body.assignedTo))
                {
                    reject({ code: 400, message: "There should be assignee for adding hiring steps", data: {} });
                }
                else
                {
                    var positions=await client.query(queryService. getPositionName(_body));
                    var positionName=positions.rows[0].positionName
                    var companies=await client.query(queryService.getCompanyName(_body));
                    var companyName=companies.rows[0].companyName
                    let names = await client.query(queryService.getAssigneeName(_body));
                    let assigneeName=names.rows[0].firstname
                    _body.auditLogComment=`${assigneeName} (${companyName}) has moved the candidate ${_body.candidateName} to ${_body.hiringStepName} for the position ${positionName}`
                    await client.query(queryService.insertAuditLogForHiring(_body))
                    await client.query(queryService.moveCandidateHiringStepQuery(_body)); 
                    _body.assigneeComment=`${assigneeName} has moved the candidate to ${_body.hiringStepName}`
                    await client.query(queryService.updateAssigneeComments(_body));
                    await client.query(queryService.updateCurrentStage(_body)); 
                    resolve({ code: 200, message: "Hiring step moved successfully", data: {} });
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

export const rejectFromHiringProcess = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                if([undefined,null,''].includes(_body.assignedTo))
                {
                    reject({ code: 400, message: "There should be assignee for adding hiring steps", data: {} });
                }
                else
                {
                    _body.hiringStepName = 'Rejected';
                    var positions=await client.query(queryService. getPositionName(_body));
                    var positionName=positions.rows[0].positionName
                    var companies=await client.query(queryService.getCompanyName(_body));
                    var companyName=companies.rows[0].companyName
                    let names = await client.query(queryService.getAssigneeName(_body));
                    let assigneeName=names.rows[0].firstname
                    _body.auditLogComment=`${assigneeName} (${companyName}) has rejected the candidate ${_body.candidateName} at  ${_body.hiringStepName} for the position ${positionName}`
                    await client.query(queryService.insertAuditLogForHiring(_body));
                    await client.query(queryService.rejectFromHiringProcess(_body));
                    await client.query(queryService.updateCurrentStage(_body)); 
                    resolve({ code: 200, message: "Rejected candidate succesfully", data: {} });
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

export const addNewStageForCandidate = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                if([undefined,null,''].includes(_body.assignedTo))
                {
                    reject({ code: 400, message: "There should be assignee for adding hiring steps", data: {} });
                }
                else{
                    var positions=await client.query(queryService. getPositionName(_body));
                    var positionName=positions.rows[0].positionName
                    var companies=await client.query(queryService.getCompanyName(_body));
                    var companyName=companies.rows[0].companyName
                    let names = await client.query(queryService.getAssigneeName(_body));
                    let assigneeName=names.rows[0].firstname
                    _body.auditLogComment=`${assigneeName} (${companyName}) has added a new step named  ${_body.candidateHiringStepName}  for  the candidate ${_body.candidateName} who applied for the  position ${positionName}`
                    await client.query(queryService.insertAuditLogForHiring(_body));
                    await client.query(queryService.addNewStageForCandidate(_body));
                    resolve({ code: 200, message: "Added new stage succesfully", data: {} });
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

export const updateDefaultAssignee = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                if([undefined,null,''].includes(_body.assignedTo))
                {
                    reject({ code: 400, message: "There should be assignee for adding hiring steps", data: {} });
                }
                else{
                    var positions=await client.query(queryService. getPositionName(_body));
                    var positionName=positions.rows[0].positionName
                    var companies=await client.query(queryService.getCompanyName(_body));
                    var companyName=companies.rows[0].companyName
                    let names = await client.query(queryService.getAssigneeName(_body));
                    let assigneeName=names.rows[0].firstname
                    _body.auditLogComment=`${assigneeName} (${companyName}) is the assignee for  the candidate ${_body.candidateName} who applied for the  position ${positionName}`
                    await client.query(queryService.insertAuditLogForHiring(_body));
                    await client.query(queryService.updateDefaultAssigneeQuery(_body));
                    resolve({ code: 200, message: "Updated assignee succesfully", data: {} });
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

export const deletePositionHiringStep = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                    await client.query(queryService.deletePositionHiringStep(_body));
                    let names = await client.query(queryService.getAssigneeName(_body));
                    let assigneeName=names.rows[0].firstname
                    _body.auditLogComment=`${assigneeName} has deleted the step ${_body.positionHiringStepName} for the  position ${_body.positionName}`
                    await client.query(queryService.insertAuditLogForHiring(_body));
                    resolve({ code: 200, message: "Deleted Hiring Step succesfully", data: {} });
                
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

export const reorderHiringSteps = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            try {
                let candidateHiringStepQueries = [];
                if(![null,undefined,''].includes(_body.hiringSteps) && Array.isArray(_body.hiringSteps))
                {
                    let order = 1;
                    _body.hiringSteps.forEach(element => {
                        const insertHiringStepsQuery = {
                            name: 'add-hiring-steps',
                            text: hiringQuery.updateCandidateHiringStepOrder,
                            values: [element.candidateHiringStepId,order,Date.now()],
                        }
                        candidateHiringStepQueries.push(client.query(insertHiringStepsQuery));
                        order++;
                    });   
                }
                await Promise.all(candidateHiringStepQueries);
                await client.query('COMMIT')
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


