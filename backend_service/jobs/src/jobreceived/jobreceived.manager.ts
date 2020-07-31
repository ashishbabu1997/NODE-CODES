import jobReceivedQuery from './query/jobreceived.query';
import database from '../common/database/database';
import * as format from 'pg-format';

export const getAllJobReceived = (_body) => {

    return new Promise((resolve, reject) => {

        var selectQuery = jobReceivedQuery.getAllJobReceived;

        if (_body.filter) {
            selectQuery = selectQuery + " AND (LOWER(position_name ) LIKE '%" + _body.filter.toLowerCase() + "%' OR LOWER(position_name ) LIKE '%" + _body.filter.toLowerCase() + "%') "
        }

        if (_body.sortBy) {
            selectQuery = selectQuery + ' ORDER BY position_name ' + _body.sortBy.toUpperCase();
        }

        if (_body.limit && _body.skip) {
            selectQuery = selectQuery + ' LIMIT ' + _body.limit + ' OFFSET ' + _body.skip;
        }
        const query = {
            name: 'get-AllActivePositions',
            text: selectQuery
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Job Received listed successfully", data: { Jobs: results.rows } });
        })
    })
}

export const getJobReceivedByJobReceivedId = (_body) => {
    return new Promise((resolve, reject) => {
        const query = {
            name: 'get-JobReceivedByJobReceivedId',
            text: jobReceivedQuery.getJobReceivedById,
            values: [parseInt(_body.jobReceivedId), parseInt(_body.sellerCompanyId)]
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Job Received listed successfully", data: { Jobs: results.rows } });
        })
    })
}

export const updateflagForJobReceived = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'update-position-flag',
            text: jobReceivedQuery.updateFlag,
            values: [ _body.jobReceivedId, _body.companyId, _body.flag, _body.userId, currentTime]
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

export const updateIsRejectForJobReceived = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'update-JobReceived-reject',
            text: jobReceivedQuery.updateReject,
            values: [ _body.jobReceivedId, _body.companyId, _body.reject, _body.userId, currentTime]
        }

        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "IsReject updated successfully", data: {} });
        })
    })
}

export const saveCandidateProfile = (_body) => {
    return new Promise((resolve, reject) => {
        var myArray =  _body.candidates;
        var candidates = new Array();
        for (var i in myArray) {
           var tempArray = new Array();
           for(var key in myArray[i]){
               tempArray.push(myArray[i][key]);
           }
        tempArray.push(_body.candidateStatus);
        candidates.push(tempArray);
       }
        const query = {
            name: 'add-Profile',
            text: format(jobReceivedQuery.addProfile, candidates),
        }
        
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Profile added successfully", data: { profiles : results.rows } });
        })
    })
}

export const getProfileByCompanyId = (_body) => {
    return new Promise((resolve, reject) => {
        const query = {
            name: 'get-ProfileByCompanyId',
            text: jobReceivedQuery.getProfile,
            values: [parseInt(_body.companyId),parseInt(_body.jobReceivedId)]
        }

        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Profile listed successfully", data: { profile: results.rows } });
        })
    })
}