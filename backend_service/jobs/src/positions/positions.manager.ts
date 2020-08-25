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
            values: _body.searchKey != '' ? [parseInt(_body.companyId), orderBy[_body.sortBy], _body.limit, _body.offset, '%' + _body.searchKey.toLowerCase() + '%'] : [parseInt(_body.companyId), orderBy[_body.sortBy], _body.limit, _body.offset],
        }
        console.log(query)
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Positions listed successfully", data: { positions: results.rows } });
        })
    })
}

export const createCompanyPositions = async (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                const addCompanyPositionsQuery = {
                    name: 'add-company-positions',
                    text: positionsQuery.addCompanyPositions,
                    values: [_body.positionName, _body.locationName, _body.developerCount, _body.companyId,
                    _body.allowRemote, _body.experienceLevel, _body.jobDescription, _body.document, _body.contractPeriodId,
                    _body.currencyTypeId, _body.billingType, _body.minBudget, _body.maxBudget, _body.hiringStepId,
                    _body.userId, _body.userId, currentTime, currentTime, _body.jobCategoryId]
                }
                const companyPositionResponse = await client.query(addCompanyPositionsQuery);
                const positionId = companyPositionResponse.rows[0].position_id
                const addJobSkillsQuery = {
                    name: 'add-job-skills',
                    text: positionsQuery.addJobSkills,
                    values: [positionId, _body.skills, currentTime, currentTime],
                }
                await client.query(addJobSkillsQuery)
                if (_body.flag == 0) {
                    await client.query('COMMIT');
                    resolve({ code: 200, message: "Positions created successfully", data: { positionId } });
                    return;
                }
                const addPositionHiringStepQuery = {
                    name: 'add-position-hiring-steps',
                    text: positionsQuery.addPositionSteps,
                    values: [positionId, _body.hiringStepName, _body.description, currentTime, currentTime],
                }
                const res = await client.query(addPositionHiringStepQuery)
                const hiringStages = _body.hiringStages;
                const positionHiringStepId = res.rows[0].position_hiring_step_id;
                let hiringStageValues = ''
                const length = hiringStages.length;
                hiringStages.forEach((element, i) => {
                    const end = i != length - 1 ? "," : ";"
                    hiringStageValues = hiringStageValues + "('" + element.hiringStageName + "','" + element.hiringStageDescription + "'," + positionHiringStepId + "," + element.hiringStageOrder + "," + element.coordinatorId + "," + currentTime + "," + currentTime + ")" + end
                });
                const addPositionHiringStagesQuery = positionsQuery.addPositionHiringStages + hiringStageValues
                await client.query(addPositionHiringStagesQuery)
                await client.query('COMMIT')
                resolve({ code: 200, message: "Positions created successfully", data: { positionId } });
            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
            } finally {
                client.release();
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
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
                console.log(error)
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            const hiringSteps = results.rows;
            let groupedHiringStages = [];
            let skills = [];
            let result = {};
            hiringSteps.forEach(step => {
                result = {
                    maxBudget: step.max_budget,
                    minBudget: step.min_budget,
                    billingType: step.billing_type,
                    contractPeriodId: step.contract_period,
                    currencyTypeId: step.currency_type_id,
                    developerCount: step.developer_count,
                    allowRemote: step.allow_remote,
                    experienceLevel: step.experience_level,
                    document: step.job_document,
                    positionName: step.position_name,
                    locationName: step.location_name,
                    createdOn: step.created_on,
                    jobDescription: step.job_description,
                    hiringStepId: step.position_hiring_step_id,
                    hiringStepName: step.hiring_step_name,
                    hiringStepDescription: step.description,
                    jobCategoryId: step.job_category_id,
                    hiringStages: [],
                    skills: []
                }
                if (step.position_hiring_stage_id != null && groupedHiringStages.findIndex(({ hiringStageId }) => hiringStageId === step.position_hiring_stage_id) === -1)
                    groupedHiringStages.push(
                        {
                            hiringStageId: step.position_hiring_stage_id,
                            hiringStageName: step.hiring_stage_name,
                            hiringStageDescription: step.position_hiring_stage_description,
                            hiringStageOrder: step.hiring_stage_order,
                        }
                    )
                if (step.skill_id != null && skills.findIndex(({ skillId }) => skillId === step.skill_id) === -1)
                    step.skill_id != null && skills.push(
                        {
                            skillId: step.skill_id,
                            skillName: step.skill_name
                        }
                    )
                result['hiringStages'] = groupedHiringStages;
                result['skills'] = skills;
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
                        hiringStageValues = hiringStageValues + "(" + element.hiringStageId + ",'" + element.hiringStageName + "','" + element.hiringStageDescription + "'," + element.hiringStageOrder + "," + element.coordinatorId + "," + currentTime + ")" + end
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

export const updateCompanyPositions = async (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const positionId = _body.positionId;
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                const updateCompanyPositionsFirstQuery = {
                    name: 'update-company-positions-first',
                    text: positionsQuery.updatePositionFirst,
                    values: [_body.positionName, _body.locationName, _body.developerCount,
                    _body.allowRemote, _body.experienceLevel, _body.jobDescription, _body.document,
                    _body.userId, currentTime, positionId, _body.companyId, _body.jobCategoryId]
                }
                await client.query(updateCompanyPositionsFirstQuery);
                const updateCompanyPositionsSecondQuery = {
                    name: 'update-company-positions-second',
                    text: positionsQuery.updatePositionSecond,
                    values: [_body.contractPeriodId,
                    _body.currencyTypeId, _body.billingType, _body.minBudget, _body.maxBudget, _body.hiringStepId,
                    _body.userId, currentTime, positionId, _body.companyId]
                }
                await client.query(updateCompanyPositionsSecondQuery);
                const getJobSkillsQuery = {
                    name: 'get-job-skills',
                    text: positionsQuery.getPositionSkillsOld,
                    values: [positionId, _body.companyId],
                }
                const skillsResponse = await client.query(getJobSkillsQuery);
                const oldSkills = skillsResponse.rows.length > 0 ? skillsResponse.rows[0].skills : [];
                const skills = _body.skills;
                const deletedSkills = oldSkills.filter(e => skills.indexOf(e) == -1);
                const addJobSkillsQuery = {
                    name: 'add-job-skills',
                    text: positionsQuery.addJobSkills,
                    values: [positionId, skills, currentTime, currentTime],
                }
                await client.query(addJobSkillsQuery);
                const deleteJobSkillsQuery = {
                    name: 'delete-job-skills',
                    text: positionsQuery.deletePositionSkills,
                    values: [positionId, deletedSkills],
                }
                await client.query(deleteJobSkillsQuery)
                if (_body.flag == 0) {
                    await client.query('COMMIT');
                    resolve({ code: 200, message: "Position updated successfully", data: { positionId } });
                    return;
                }
                const addPositionHiringStepQuery = {
                    name: 'add-position-hiring-steps',
                    text: positionsQuery.addPositionSteps,
                    values: [positionId, _body.hiringStepName, _body.description, currentTime, currentTime],
                }
                const res = await client.query(addPositionHiringStepQuery)
                const hiringStages = _body.hiringStages;
                const positionHiringStepId = res.rows[0].position_hiring_step_id;
                let hiringStageValues = ''
                const length = hiringStages.length;
                hiringStages.forEach((element, i) => {
                    const end = i != length - 1 ? "," : ";"
                    hiringStageValues = hiringStageValues + "('" + element.hiringStageName + "','" + element.hiringStageDescription + "'," + positionHiringStepId + "," + element.hiringStageOrder + "," + element.coordinatorId + "," + currentTime + "," + currentTime + ")" + end
                });
                const addPositionHiringStagesQuery = positionsQuery.addPositionHiringStages + hiringStageValues
                await client.query(addPositionHiringStagesQuery)
                await client.query('COMMIT')
                resolve({ code: 200, message: "Position updated successfully", data: { positionId } });
            } catch (e) {
                await client.query('ROLLBACK')
                console.log(e)
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
            } finally {
                client.release();
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
        })
    })
}


export const publishCompanyPositions = async (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                const positionId = _body.positionId;
                const changePositionStatusQuery = {
                    name: 'change-position-status',
                    text: positionsQuery.changePositionStatus,
                    values: [positionId, currentTime]
                }
                await client.query(changePositionStatusQuery);
                const addPositionToJobReceivedQuery = {
                    name: 'add-position-to-job-received',
                    text: positionsQuery.addPositionToJob,
                    values: [positionId, currentTime],
                }
                await client.query(addPositionToJobReceivedQuery);
                await client.query('COMMIT');
                resolve({ code: 200, message: "Position published successfully", data: {} });
            } catch (e) {
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
            } finally {
                client.release();
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
        })
    })
}
export const closeJobStatus = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const positionQuery = {
            name: 'close-job-status',
            text: positionsQuery.closeJobs,
            values: [currentTime, _body.positionId],
        }
        database().query(positionQuery, (error, results) => {
            if (error) {
                console.log(error)
                reject({ code: 400, message: "Error in database connection.", data: {} });
                return;
            }
            const jobReceivedQuery = {
                name: 'close-job-status',
                text: positionsQuery.closeJobReceived,
                values: [currentTime, _body.positionId],
            }
            database().query(jobReceivedQuery, (error, results) => {
                if (error) {
                    console.log(error)
                    reject({ code: 400, message: "Error in database connection.", data: {} });
                    return;
                }
                else {
                    resolve({ code: 200, message: "Job status closed", data: {} });
                }
            })
        })
    })
}
