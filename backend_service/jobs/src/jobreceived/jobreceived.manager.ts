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
            text: selectQuery,
            values: [_body.companyId]
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            console.log(results.rows)
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
            resolve({ code: 200, message: "Job Received listed successfully", data: results.rows[0] });
        })
    })
}

export const updateflagForJobReceived = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'update-position-flag',
            text: jobReceivedQuery.updateFlag,
            values: [_body.jobReceivedId, _body.companyId, _body.flag, _body.userId, currentTime]
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
            values: [_body.jobReceivedId, _body.companyId, _body.reject, _body.userId, currentTime]
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
        const currentTime = Math.floor(Date.now() / 1000);
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                const candidatesArray = _body.candidates;
                let candidates = candidatesArray.map(c => {
                    return [c.candidateFirstName, c.candidateLastName, c.companyId, c.jobReceivedId, c.coverNote,
                    c.rate, c.billingTypeId, c.currencyTypeId, c.email, c.phoneNumber, c.resume, c.positionId,
                        currentTime, currentTime, c.candidateStatus]
                })
                const saveCandidateQuery = {
                    name: 'add-Profile',
                    text: format(jobReceivedQuery.addProfile, candidates),
                }
                await client.query(saveCandidateQuery);
                const query = {
                    name: 'get-total-candidate-count',
                    text: jobReceivedQuery.getTotalCountOfCandidatesSubmitted,
                    values: [_body.candidates[0].positionId, _body.candidates[0].companyId],
                }
                const response = await client.query(query);
                console.log(response)
                const status = (response.rows[0].developerCount - response.rows[0].candidateCount) <= 0 ? 3 : 9
                const updateCompanyJobStatusQuery = {
                    name: 'update-company-job-status',
                    text: jobReceivedQuery.updateCompanyJobStatus,
                    values: [_body.candidates[0].jobReceivedId, _body.candidates[0].companyId, currentTime, status],
                }
                await client.query(updateCompanyJobStatusQuery);
                await client.query('COMMIT');
                resolve({ code: 200, message: "Candidate profiles added", data: {} });
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

export const getProfileByCompanyId = (_body) => {
    return new Promise((resolve, reject) => {
        const query = {
            name: 'get-ProfileByCompanyId',
            text: jobReceivedQuery.getProfile,
            values: [parseInt(_body.companyId), parseInt(_body.jobReceivedId)]
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