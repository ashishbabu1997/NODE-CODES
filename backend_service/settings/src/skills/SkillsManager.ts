import skillsQuery from './query/SkillsQuery';
import database from '../common/database/database';

export const getCompanySkills = () => {
    return new Promise((resolve, reject) => {
        const query = {
            name: 'fetch-skills',
            text: skillsQuery.getSkills,
            values: [],
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
            values: [_body.skillName, currentTime],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Skills created successfully", data: {} });
        })
    })
}

export const updateComppanySkills = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'update-sevices',
            text: skillsQuery.updateSkills,
            values: [_body.skillName, currentTime, _body.skillId],
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