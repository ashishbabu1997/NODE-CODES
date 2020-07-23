import positionsQuery from './query/positions.query';
import database from '../common/database/database';

export const getCompanyPositions = (_body) => {
    return new Promise((resolve, reject) => {
        const orderBy = {
            "position": "position_id"
        }
        const query = {
            name: 'fetch-company-positions',
            text: _body.sortType == 'ASC' ? (_body.searchKey != '' ? positionsQuery.getCompanyPositionsASCSearch : positionsQuery.getCompanyPositionsASC)
                : (_body.searchKey != '' ? positionsQuery.getCompanyPositionsDESCSearch : positionsQuery.getCompanyPositionsDESC),
            values: _body.searchKey != '' ? [parseInt(_body.companyId), orderBy[_body.sortBy], _body.limit, _body.offset, '%' + _body.searchKey + '%'] : [parseInt(_body.companyId), orderBy[_body.sortBy], _body.limit, _body.offset],
        }
        console.log(query)
        database().query(query, (error, results) => {
            if (error) {
                console.log(error, "eror")
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Positions listed successfully", data: { positions: results.rows } });
        })
    })
}

export const getAllPositionsByDescriptionKey = (_body) => {
    return new Promise((resolve, reject) => {
        var selectQuery = positionsQuery.getAllPositionByDescription;
        if(_body.descriptionKey)
        {
            selectQuery  = selectQuery +  "and job_description like '%" + _body.descriptionKey + "%'";
        }
        const query = {
            name: 'fetch-company-positions-By_Description',
            text:selectQuery,
            values: [_body.companyId]
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

export const getCompanyPositionDetailsByPositionId = (_body) => {
    return new Promise((resolve, reject) => {
        const query = {
            name: 'get-company-positions-By_PositionId',
            text:positionsQuery.getPositionDetailsByPositionId,
            values: [parseInt(_body.positionId)]
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
                            reject({ code: 400, message: "Failed. Please try again.", data: {} });
                            return;
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
                                        reject({ code: 400, message: "Failed. Please try again.", data: {} });
                                        return;
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
}

export const editCompanyPositionHiringSteps = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);

        database().connect((err, client, done) => {
            const shouldAbort = err => {
                if (err) {
                    console.error('Error in transaction', err.stack)
                    client.query('ROLLBACK', err => {
                        if (err) {
                            console.error('Error rolling back client', err.stack)
                            reject({ code: 400, message: "Failed. Please try again.", data: {} });
                            return;
                        }
                        done();
                        reject({ code: 400, message: "Failed. Please try again.", data: {} });

                    })
                }
                return !!err
            }
            client.query('BEGIN', err => {
                if (shouldAbort(err)) return
                const editHiringStepQuery = {
                    name: 'edit-position-hiring-steps',
                    text: positionsQuery.editPositionHiringSteps,
                    values: [_body.hiringStepId, _body.hiringStepName, _body.description, currentTime],
                }
                client.query(editHiringStepQuery, (err, res) => {
                    if (shouldAbort(err)) return
                    const hiringStages = _body.hiringStages;
                    let hiringStageValues = ''
                    const length = hiringStages.length;
                    hiringStages.forEach((element, i) => {
                        const end = i != length - 1 ? "," : ""
                        hiringStageValues = hiringStageValues + "(" + element.hiringStageId + ",'" + element.hiringStageName + "','" + element.hiringStageDescription + "'," + element.order + "," + element.coordinatorId + "," + currentTime + ")" + end
                    });
                    const query = positionsQuery.editPositionHiringStagesStart + hiringStageValues + positionsQuery.editPositionHiringStagesEnd
                    console.log(query)
                    client.query(query, (err, res) => {
                        if (shouldAbort(err)) return
                        client.query('COMMIT', err => {
                            if (err) {
                                console.error('Error committing transaction', err.stack)
                                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                                return;
                            }
                            done()
                            resolve({ code: 200, message: "Position hiring step updated successfully", data: {} });
                        })
                    })
                })
            })
        })
    })
}
