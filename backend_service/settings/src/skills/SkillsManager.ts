import skillsQuery from './query/SkillsQuery';
import database from '../common/database/database';

export const getCompanySkills = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
               
                await client.query('BEGIN');
                if (_body.jobCategoryId)
                {
                     const queryWithJobCategoryId = {
                        name: 'fetch-skills',
                        text: skillsQuery.getSkills,
                        values: [_body.jobCategoryId],
                    }
                    await client.query(queryWithJobCategoryId)
                }
                else{
                    const query = {
                        name: 'fetch-skills',
                        text: skillsQuery.getSkillsWithoutId,
                        values: [],
                    }
                    await client.query(query)
                }
                await client.query('COMMIT')
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
    });
}

export const createNewSkills = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                const addSkills = {
                    name: 'create-skills',
                    text: skillsQuery.createSkills,
                    values: [_body.skillName, currentTime],
                }
                const res = await client.query(addSkills);
                const skillId = res.rows[0].skill_id;
                const addJobCategorySkills = {
                    name: 'add-job-category-skills',
                    text: skillsQuery.addJobCategorySkills,
                    values: [_body.jobCategoryId, skillId, currentTime]
                }
                await client.query(addJobCategorySkills);
                await client.query('COMMIT')
                resolve({ code: 200, message: "Skills created successfully", data: {} });
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

export const updateComppanySkills = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'update-sevices',
            text: skillsQuery.updateSkills,
            values: [_body.skillName, currentTime, _body.skillId, _body.jobCategoryId],
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