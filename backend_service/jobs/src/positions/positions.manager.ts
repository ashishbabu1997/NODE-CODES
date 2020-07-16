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

