import technologyAreaQuery from './query/TechnologyAreaQuery';
import database from '../common/database/database';

export const getTechnologyAreas = () => {
    return new Promise((resolve, reject) => {
        const query = {
            name: 'fetch-technology-areas',
            text: technologyAreaQuery.getTechnologyAreas,
            values: [],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Technology areas listed successfully", data: { technologyAreas: results.rows } });
        })
    });
}

export const createNewTechnologyArea = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'create-technology-area',
            text: technologyAreaQuery.createTechnologyArea,
            values: [_body.technologyName, currentTime],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Tecchnology area created successfully", data: {} });
        })
    })
}

export const updateTechnologyAreaType = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'update-technology-area',
            text: technologyAreaQuery.updateTechnologyArea,
            values: [_body.technologyName, currentTime, _body.technologyAreaId],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Technology area updated successfully", data: {} });
        })
    })
}

export const deleteTechnologyAreaType = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'delete-technology-area',
            text: technologyAreaQuery.deleteTechnologyArea,
            values: [currentTime, _body.technologyAreaId],
        }
        database().query(query, (error, results) => {
            if (error) {
                console.log(error)
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Technology area deleted successfully", data: {} });
        })
    })
}