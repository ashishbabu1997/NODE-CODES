import positionsQuery from './query/jobreceived.query';
import database from '../common/database/database';
import * as format from 'pg-format';

export const getAllActivePositions = (_body) => {

    return new Promise((resolve, reject) => {

        var selectQuery = positionsQuery.getAllActivePositions;

        if (_body.filter) {
            selectQuery = selectQuery + "AND (LOWER(position_name ) LIKE '%" + _body.filter.toLowerCase() + "%' OR LOWER(position_name ) LIKE '%" + _body.filter.toLowerCase() + "%') "
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
            resolve({ code: 200, message: "Jobs listed successfully", data: { Jobs: results.rows } });
        })
    })
}

export const getPositionByPositionId = (_body) => {
    return new Promise((resolve, reject) => {
        const query = {
            name: 'get-AllActivePositions',
            text: positionsQuery.getPositionByPositionID,
            values: [parseInt(_body.PositionId)]
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Position listed successfully", data: { Jobs: results.rows } });
        })
    })
}

export const updateflagForPosition = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const column_name = {
            'flag' : 'is_flag'
        }
        var sqlJob = format(positionsQuery.createOrUpdateJob,column_name.flag, column_name.flag, column_name.flag)
        const query = {
            name: 'update-position-flag',
            text: sqlJob,
            values: [ _body.positionId, _body.companyId, _body.flag, _body.userId, currentTime]
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

export const updateIsRejectForPosition = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const column_name = {
            'reject' : 'is_reject'
        }
        var sqlJob = format(positionsQuery.createOrUpdateJob,column_name.reject, column_name.reject, column_name.reject)
        const query = {
            name: 'update-position-reject',
            text: sqlJob,
            values: [ _body.positionId, _body.companyId, _body.reject, _body.userId, currentTime]
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

export const addProfile = (_body) => {
    return new Promise((resolve, reject) => {
        var myArray =  _body.candidates;
        var candidates = new Array();
        for (var i in myArray) {
           var tempArray = new Array();
           for(var key in myArray[i]){
               tempArray.push(myArray[i][key]);
           }
        candidates.push(tempArray);
       }
        const query = {
            name: 'add-Profile',
            text: format(positionsQuery.addProfile, candidates),
        }
        
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Profile added successfully", data: { Candidates: results.rows } });
        })
    })
}

export const getProfileByCompanyId = (_body) => {
    return new Promise((resolve, reject) => {
        const query = {
            name: 'get-ProfileByCompanyId',
            text: positionsQuery.getProfile,
            values: [parseInt(_body.companyId)]
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