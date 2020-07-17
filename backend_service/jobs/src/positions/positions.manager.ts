import positionsQuery from './query/positions.query';
import database from '../common/database/database';
import * as format from 'pg-format';

export const getCompanyPositions = (_body) => {
    return new Promise((resolve, reject) => {
        const orderBy = {
            "position": "position_id"
        }
        const query = {
            name: 'fetch-company-positions',
            text: _body.sortType == 'ASC' ? (_body.searchKey != '' ? positionsQuery.getCompanyPositionsASCSearch : positionsQuery.getCompanyPositionsASC)
                : (_body.searchKey != '' ? positionsQuery.getCompanyPositionsDESCSearch : positionsQuery.getCompanyPositionsDESC),
            values: [parseInt(_body.companyId), orderBy[_body.sortBy], _body.limit, _body.offset, '%' + _body.searchKey + '%'],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Positions listed successfully", data: { positions: results.rows } });
        })
    })
}

<<<<<<< HEAD

export const fetchPositionDetails = (_body) => {
    return new Promise((resolve, reject) => {
        const query = {
            name: 'fetch-position-details',
            text: positionsQuery.getPositionDetailsQuery,
            values: [parseInt(_body.positionId)],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            const hiringSteps = results.rows;
            let groupedHiringStages = []
            let result = {}
            hiringSteps.forEach(step => {
                result = {
                    positionName: step.position_name,
                    location: step.location_name,
                    createdOn: step.created_on,
                    jobDescription: step.job_description,
                    hiringStepId: step.position_hiring_step_id,
                    hiringStepName: step.hiring_step_name,
                    hiringStepDescription: step.description,
                    hiringStages: []
                }
                groupedHiringStages.push(
                    step.position_hiring_stage_id != null && {
                        hiringStageId: step.position_hiring_stage_id,
                        hiringStageName: step.hiring_stage_name,
                        hiringStageDescription: step.position_hiring_stage_description,
                        hiringStageOrder: step.hiring_stage_order,
                    } 
                )
                result['hiringStages'] = groupedHiringStages;
            })
            resolve({ code: 200, message: "Fetched position details successfully", data: result });
        })
    });
=======
export const getAllActivePositions = (_body) => {
 
    return new Promise((resolve, reject) => {
    
        var selectQuery = positionsQuery.getAllActivePositions;

        if(_body.filter)
        {
            selectQuery =selectQuery +  "AND (LOWER(position_name ) LIKE '%" +_body.filter.toLowerCase() + "%' OR LOWER(position_name ) LIKE '%" +  _body.filter.toLowerCase() + "%') "
        }

        if(_body.sortBy){
            selectQuery  = selectQuery + ' ORDER BY position_name ' + _body.sortBy.toUpperCase();
        }

        if(_body.limit && _body.skip){
            selectQuery = selectQuery + ' LIMIT ' + _body.limit + ' OFFSET ' + _body.skip;
        }
    const query = {
            name: 'get-AllActivePositions',
            text: selectQuery
        }
        database().query(query, (error, results) => {
            console.log(query);
            if (error) {
                console.log(error);
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Jobs listed successfully", data: { Jobs: results.rows } });
        })
    })   
}

export const getPositionByPositionId = (_body) => {
    console.log(_body);
    return new Promise((resolve, reject) => {
    const query = {
            name: 'get-AllActivePositions',
            text: positionsQuery.getPositionByPositionID,
            values: [parseInt(_body.PositionId)]
        }
        database().query(query, (error, results) => {
            console.log(query);
            if (error) {
                console.log(error);
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Position listed successfully", data: { Jobs: results.rows } });
        })
    })   
>>>>>>> feature/job_received
}

export const createCompanyPositions = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);

        database().connect((err, client, done) => {
            const shouldAbort = err => {
                if (err) {
                    console.error('Error in transaction', err.stack)
                    client.query('ROLLBACK', err => {
                        if (err) {
                            console.error('Error rolling back client', err.stack)
                        }
                        done();
                        reject({ code: 400, message: "Failed. Please try again.", data: {} });

                    })
                }
                return !!err
            }
            client.query('BEGIN', err => {
                if (shouldAbort(err)) return
                const addCompanyPositionsQuery = {
                    name: 'add-company-positions',
                    text: positionsQuery.addCompanyPositions,
                    values: [_body.positionName, _body.locationName, _body.developerCount, _body.companyId,
                    _body.allowRemote, _body.experienceLevel, _body.jobDescription, _body.document, _body.contractPeriodId,
                    _body.currencyTypeId, _body.billingType, _body.minBudget, _body.maxBudget, _body.hiringStepId,
                    _body.userId, _body.userId, currentTime, currentTime],
                }
                client.query(addCompanyPositionsQuery, (err, res) => {
                    console.log(addCompanyPositionsQuery);
                    if (shouldAbort(err)) return
                    const positionId = res.rows[0].position_id
                    const addJobSkillsQuery = {
                        name: 'add-job-skills',
                        text: positionsQuery.addJobSkills,
                        values: [positionId, _body.skills, currentTime, currentTime],
                    }
                    client.query(addJobSkillsQuery, (err, res) => {
                        if (shouldAbort(err)) return
                        const addPositionHiringStepQuery = {
                            name: 'add-position-hiring-steps',
                            text: positionsQuery.addPositionSteps,
                            values: [positionId, _body.hiringStepName, _body.description, currentTime, currentTime],
                        }
                        client.query(addPositionHiringStepQuery, (err, res) => {
                            if (shouldAbort(err)) return
                            const hiringStages = _body.hiringStages;
                            const positionHiringStepId = res.rows[0].position_hiring_step_id;
                            let hiringStageValues = ''
                            const length = hiringStages.length;
                            hiringStages.forEach((element, i) => {
                                const end = i != length - 1 ? "," : ";"
                                hiringStageValues = hiringStageValues + "('" + element.hiringStageName + "','" + element.hiringStageDescription + "'," + positionHiringStepId + "," + element.order + "," + element.coordinatorId + "," + currentTime + "," + currentTime + ")" + end
                            });
                            const query = positionsQuery.addPositionHiringStages + hiringStageValues
                            client.query(query, (err, res) => {
                                if (shouldAbort(err)) return
                                client.query('COMMIT', err => {
                                    if (err) {
                                        console.error('Error committing transaction', err.stack)
                                    }
                                    done()
                                    resolve({ code: 200, message: "Positions created successfully", data: {} });
                                })
                            })
                        })
                    })
                })
            })
        })
    })
}

export const updateflagForPosition = (_body) => {
    console.log(_body);
    return new Promise((resolve, reject) => {
    const query = {
            name: 'update-position-flag',
            text: positionsQuery.updateFlag,
            values: [ _body.flag, _body.positionId]
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Flag updated successfully", data: {} });
        })
    })
}

export const updateIsRejectForPosition = (_body) => {
    return new Promise((resolve, reject) => {
    const query = {
            name: 'update-position-IsReject',
            text: positionsQuery.updateReject,
            values: [ _body.reject, _body.positionId]
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Flag updated successfully", data: {} });
        })
    })
}

export const addProfile = (_body) => {
    return new Promise((resolve, reject) => {
    const query = {
            name: 'add-Profile',
            text: format(positionsQuery.addProfile, _body.candidates),
        }
        database().query(query, (error, results) => {
            console.log(query);
            if (error) {
                console.log(error);
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Profile added successfully", data: { Jobs: results.rows } });
        })
    })   
}

export const getProfileByCompanyId = (_body) => {
    return new Promise((resolve, reject) => {
    const query = {
            name: 'get-ProfileByCompanyId',
            text: positionsQuery.getProfile,
            values: [parseInt(_body.companyId)]
        }
        database().query(query, (error, results) => {
            console.log(query);
            if (error) {
                console.log(error);
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Profile listed successfully", data: { profile: results.rows } });
        })
    })   
}
