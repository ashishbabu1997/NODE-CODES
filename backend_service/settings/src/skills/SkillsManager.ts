import skillsQuery from './query/SkillsQuery';
import database from '../common/database/database';

export const getCompanySkills = (_body) => {
    return new Promise((resolve, reject) => {
        const query = {
            name: 'fetch-skills',
            text: skillsQuery.getSkills,
            values: [_body.jobCategoryId],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Skills listed successfully", data: { skills: results.rows } });
        })
    });
}

export const createNewSkills = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'create-services',
            text: skillsQuery.createSkills,
            values: [_body.skillName, currentTime,_body.jobCategoryId],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Skills created successfully", data: {} });
        })

        // (async () => {
        //     const client = await database().connect()
        //     try {
        //         await client.query('BEGIN');
        //         const addSkills = {
        //             name: 'update-company-positions-first',
        //             text: positionsQuery.updatePositionFirst,
        //             values: [_body.positionName, _body.locationName, _body.developerCount,
        //             _body.allowRemote, _body.experienceLevel, _body.jobDescription, _body.document,
        //             _body.userId, currentTime, positionId, _body.companyId, _body.jobCategoryId]
        //         }
        //         await client.query(updateCompanyPositionsFirstQuery);
        //         const updateCompanyPositionsSecondQuery = {
        //             name: 'update-company-positions-second',
        //             text: positionsQuery.updatePositionSecond,
        //             values: [_body.contractPeriodId,
        //             _body.currencyTypeId, _body.billingType, _body.minBudget, _body.maxBudget, _body.hiringStepId,
        //             _body.userId, currentTime, positionId, _body.companyId]
        //         }
        //         await client.query(updateCompanyPositionsSecondQuery);
        //         const getJobSkillsQuery = {
        //             name: 'get-job-skills',
        //             text: positionsQuery.getPositionSkillsOld,
        //             values: [positionId, _body.companyId],
        //         }
        //         const skillsResponse = await client.query(getJobSkillsQuery);
        //         const oldSkills = skillsResponse.rows.length > 0 ? skillsResponse.rows[0].skills : [];
        //         const skills = _body.skills;
        //         const deletedSkills = oldSkills.filter(e => skills.indexOf(e) == -1);
        //         const addJobSkillsQuery = {
        //             name: 'add-job-skills',
        //             text: positionsQuery.addJobSkills,
        //             values: [positionId, skills, currentTime, currentTime],
        //         }
        //         await client.query(addJobSkillsQuery);
        //         const deleteJobSkillsQuery = {
        //             name: 'delete-job-skills',
        //             text: positionsQuery.deletePositionSkills,
        //             values: [positionId, deletedSkills],
        //         }
        //         await client.query(deleteJobSkillsQuery)
        //         if (_body.flag == 0) {
        //             await client.query('COMMIT');
        //             resolve({ code: 200, message: "Position updated successfully", data: { positionId } });
        //             return;
        //         }
        //         const addPositionHiringStepQuery = {
        //             name: 'add-position-hiring-steps',
        //             text: positionsQuery.addPositionSteps,
        //             values: [positionId, _body.hiringStepName, _body.description, currentTime, currentTime],
        //         }
        //         const res = await client.query(addPositionHiringStepQuery)
        //         const hiringStages = _body.hiringStages;
        //         const positionHiringStepId = res.rows[0].position_hiring_step_id;
        //         let hiringStageValues = ''
        //         const length = hiringStages.length;
        //         hiringStages.forEach((element, i) => {
        //             const end = i != length - 1 ? "," : ";"
        //             hiringStageValues = hiringStageValues + "('" + element.hiringStageName + "','" + element.hiringStageDescription + "'," + positionHiringStepId + "," + element.hiringStageOrder + "," + currentTime + "," + currentTime + ")" + end
        //         });
        //         const addPositionHiringStagesQuery = positionsQuery.addPositionHiringStages + hiringStageValues
        //         await client.query(addPositionHiringStagesQuery)
        //         await client.query('COMMIT')
        //         resolve({ code: 200, message: "Position updated successfully", data: { positionId } });
        //     } catch (e) {
        //         await client.query('ROLLBACK')
        //         console.log(e)
        //         reject({ code: 400, message: "Failed. Please try again.", data: {} });
        //     } finally {
        //         client.release();
        //     }
        // })().catch(e => {
        //     reject({ code: 400, message: "Failed. Please try again.", data: {} })
        // })
    })
}

export const updateComppanySkills = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'update-sevices',
            text: skillsQuery.updateSkills,
            values: [_body.skillName, currentTime, _body.skillId,_body.jobCategoryId],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Skill updated successfully", data: {} });
        })
    })
}

export const deleteCompanySkills = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'delete-sevices',
            text: skillsQuery.deleteSkills,
            values: [currentTime, _body.skillId],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Skills deleted successfully", data: {} });
        })
    })
}