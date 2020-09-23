import positionsQuery from './query/positions.query';
import database from '../common/database/database';
import { createNotification } from '../common/notifications/notifications';

export const getCompanyPositions = (_body) => {
    return new Promise((resolve, reject) => {
        var queryText;
        var queryValues;
        const orderBy = {
            "position": 'p.position_id',
            "positionName": 'p.position_name',
            "createdOn": 'p.created_on',
            "candidateCount": '"candidateCount"',
            "resourceCount": 'p.developer_count',
            "companyName": 'c.company_name'
        }

        var sort = ' ORDER BY ' + orderBy[_body.sortBy] + ' ' + _body.sortType + ' LIMIT ' + _body.limit + ' OFFSET ' + _body.offset;

        if (_body.userRoleId == 1) {
            queryText = positionsQuery.getCompanyPositionsForAdmin + sort;
            queryValues = ['%' + _body.searchKey + '%']
        }
        else {
            queryText = positionsQuery.getCompanyPositionsForBuyer + sort;
            queryValues = [_body.companyId, '%' + _body.searchKey + '%']
        }


        const query = {
            name: 'id-fetch-company-positions',
            text: queryText,
            values: queryValues
        }
        database().query(query, (error, results) => {
            if (error) {
                console.log(error)
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            var steps = results.rows
            resolve({ code: 200, message: "Positions listed successfully", data: { positions: steps } })
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
                const getCompanyNameQuery = {
                    name: 'get-company-name',
                    text: positionsQuery.getCompanyName,
                    values: [_body.companyId]
                }
                const getCompanyNameResponse = await client.query(getCompanyNameQuery);
                const companyName = getCompanyNameResponse.rows[0].companyName
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
                    resolve({ code: 200, message: "Positions created successfully", data: { positionId, companyName } });
                    return;
                }
                // const addPositionHiringStepQuery = {
                //     name: 'add-position-hiring-steps',
                //     text: positionsQuery.addPositionSteps,
                //     values: [positionId, _body.hiringStepName, _body.description, currentTime, currentTime],
                // }
                // const res = await client.query(addPositionHiringStepQuery)
                // const hiringStages = _body.hiringStages;
                // const positionHiringStepId = res.rows[0].position_hiring_step_id;
                // let hiringStageValues = ''
                // const length = hiringStages.length;
                // hiringStages.forEach((element, i) => {
                //     const end = i != length - 1 ? "," : ";"
                //     hiringStageValues = hiringStageValues + "('" + element.hiringStageName + "','" + element.hiringStageDescription + "'," + positionHiringStepId + "," + element.hiringStageOrder + "," + currentTime + "," + currentTime + ")" + end
                // });
                // const addPositionHiringStagesQuery = positionsQuery.addPositionHiringStages + hiringStageValues
                // await client.query(addPositionHiringStagesQuery)
                const assessmentTraits = _body.assessmentTraits;
                const getPositionAssessmentTraitsQuery = {
                    name: 'get-position-assessment-traits-old',
                    text: positionsQuery.getAssessmentTraitOld,
                    values: [positionId]
                }
                const previousData = await client.query(getPositionAssessmentTraitsQuery);
                if (previousData.rows.length > 0) {
                    const assessmentTraitsOld = previousData.rows;
                    const deletedAssessmentTraits = assessmentTraitsOld.filter(e => assessmentTraits.indexOf(e) == -1);
                    const deletedAssessmentTraitsQuery = {
                        name: 'delete-company-services',
                        text: positionsQuery.deleteAssessmentTraits,
                        values: [positionId, deletedAssessmentTraits],
                    }
                    await client.query(deletedAssessmentTraitsQuery);
                }
                const addAssessmentTraitsQuery = {
                    name: 'create-assessment-traits',
                    text: positionsQuery.addAssessmentTraits,
                    values: [positionId, assessmentTraits, currentTime, currentTime],
                }
                let x = await client.query(addAssessmentTraitsQuery);
                await client.query('COMMIT')
                resolve({ code: 200, message: "Positions created successfully", data: { positionId } });
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
                    assessmentTraits: step.assessmentTraits,
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
                    jobStatus: step.job_status,
                    jobCategoryName: step.job_category_name,
                    companyId: step.company_id,
                    companyName: step.company_name,
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
                        hiringStageValues = hiringStageValues + "(" + element.hiringStageId + ",'" + element.hiringStageName + "','" + element.hiringStageDescription + "'," + element.hiringStageOrder + "," + currentTime + ")" + end
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
                const getCompanyNameQuery = {
                    name: 'get-company-name',
                    text: positionsQuery.getCompanyName,
                    values: [_body.companyId]
                }
                const getCompanyNameResponse = await client.query(getCompanyNameQuery);
                const companyName = getCompanyNameResponse.rows[0].companyName
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
                    resolve({ code: 200, message: "Position updated successfully", data: { positionId, companyName } });
                    return;
                }
                // const editPositionHiringStepQuery = {
                //     name: 'edit-position-hiring-steps',
                //     text: positionsQuery.editPositionHiringSteps,
                //     values: [_body.hiringStepId, _body.hiringStepName, _body.description, currentTime],
                // }
                // const res = await client.query(editPositionHiringStepQuery)
                // console.log(res)
                // const hiringStages = _body.hiringStages;
                // let hiringStageValues = ''
                // const length = hiringStages.length;
                // hiringStages.forEach((element, i) => {
                //     const end = i != length - 1 ? "," : ""
                //     hiringStageValues = hiringStageValues + "(" + element.hiringStageId + ",'" + element.hiringStageName + "','" + element.hiringStageDescription + "'," + element.hiringStageOrder + "," + currentTime + ")" + end
                // });
                // const addPositionHiringStagesQuery = positionsQuery.editPositionHiringStagesStart + hiringStageValues + positionsQuery.editPositionHiringStagesEnd
                // await client.query(addPositionHiringStagesQuery)
                const assessmentTraits = _body.assessmentTraits;
                const getPositionAssessmentTraitsQuery = {
                    name: 'get-position-assessment-traits-old',
                    text: positionsQuery.getAssessmentTraitOld,
                    values: [positionId]
                }
                const previousData = await client.query(getPositionAssessmentTraitsQuery);

                console.log(previousData,"sadas")
                if (previousData.rows.length > 0) {
                    const assessmentTraitsOld = previousData.rows;
                    const deletedAssessmentTraits = assessmentTraitsOld.filter(e => assessmentTraits.indexOf(e) == -1).map(item => { return item.positionReviewId });
                    const deletedAssessmentTraitsQuery = {
                        name: 'delete-company-services',
                        text: positionsQuery.deleteAssessmentTraits,
                        values: [positionId, deletedAssessmentTraits],
                    }
                    await client.query(deletedAssessmentTraitsQuery);
                }
                const addAssessmentTraitsQuery = {
                    name: 'create-assessment-traits',
                    text: positionsQuery.addAssessmentTraits,
                    values: [positionId, assessmentTraits, currentTime, currentTime],
                }
                let x = await client.query(addAssessmentTraitsQuery);
                console.log(x)
                await client.query('COMMIT')
                resolve({ code: 200, message: "Position updated successfully", data: { positionId, companyName } });
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
                const data = await client.query(addPositionToJobReceivedQuery);
                const jobReceivedId = data.rows[0].job_received_id
                const getNotificationDetailsQuery = {
                    name: 'get-notification-details',
                    text: positionsQuery.getNotificationDetails,
                    values: [positionId]
                }
                const details = await client.query(getNotificationDetailsQuery);
                await client.query('COMMIT');
                const { companyId, companyName } = details.rows[0];
                const message = `A new position has been created by ${companyName}.`
                await createNotification({ positionId, jobReceivedId, companyId, message, candidateId: null, notificationType: 'position' })
                resolve({ code: 200, message: "Position published successfully", data: {} });
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
export const getCompanies = (_body) => {
    return new Promise((resolve, reject) => {
        console.log("accountType : ", _body.accountType);

        const CompanyQuery = {
            name: 'get-company-names',
            text: positionsQuery.getNames,
            values: [_body.accountType],
        }
        database().query(CompanyQuery, (error, results) => {
            if (error) {
                console.log(error)
                reject({ code: 400, message: "Error in database connection.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Companies listed successfully", data: { companies: results.rows } });


        })
    })
}
