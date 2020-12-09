import servicesQuery from './query/ServicesQuery';
import database from '../common/database/database';


 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Get all services from database
export const getServices = () => {
    return new Promise((resolve, reject) => {
        const query = {
            name: 'fetch-services',
            text: servicesQuery.getServices,
            values: [],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Services listed successfully", data: { services: results.rows } });
        })
    });
}


 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Create new service 
export const createNewServices = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'create-services',
            text: servicesQuery.createServices,
            values: [_body.serviceName, currentTime],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Service created successfully", data: {} });
        })
    })
}


 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Update services
export const updateServiceType = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'update-sevices',
            text: servicesQuery.updateServices,
            values: [_body.serviceName, currentTime, _body.serviceId],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Services updated successfully", data: {} });
        })
    })
}



 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Delete services
export const deleteServiceType = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'delete-sevices',
            text: servicesQuery.deleteServices,
            values: [currentTime, _body.serviceId],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Services deleted successfully", data: {} });
        })
    })
}