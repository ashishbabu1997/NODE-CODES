import candidateQuery from './query/candidates.query';
import database from '../common/database/database';
import {Promise} from "es6-promise";
export const getCandidateDetails = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
                name: 'get-candidate-details',
                text: candidateQuery.list,
                values: [_body.candidateId],
            }
            database().query(query, (error, results) => {
                if (error) {
                    reject({ code: 400, message: "Database Error", data: {} });
                    return;
                }
                const candidates=results.rows
                let result = {};
                candidates.forEach(step => {
                    result= {
                        candidateName: step.candidateName,
                        companyName: step.companyName,
                        positionName: step.positionName,
                        description: step.description,
                        coverNote: step.coverNote,
                        resume: step.resume,
                        rate: step.rate,
                        phoneNumber: step.phoneNumber,
                        label: step.label,
                        emailAddress: step.emailAddress,
                        status: step.status,
                        candidateStatus: step.candidateStatus,
                        jobReceivedId: step.jobReceivedId
                    }
                resolve({ code: 200, message: "Candidate details listed successfully", data:{candidate:result} });
                })
            })
        })
    }
export const listCandidatesDetails = (_body) => {
    return new Promise((resolve, reject) => {
            var selectQuery = candidateQuery.listCandidates;
            if(_body.filter)
            {
                 selectQuery =selectQuery +" "+"AND ((LOWER(c.candidate_name) LIKE '%" +_body.filter.toLowerCase() +"%') " + "OR (LOWER(p.company_name) LIKE '%" + _body.filter.toLowerCase() + "%')) "
            }
            const listquery = {
                name: 'list-candidates',
                text:selectQuery,
                values:[_body.positionId]
            }
            database().query(listquery, (error, results) => {
                if (error) {
                    console.log(error, "eror")
                    reject({ code: 400, message: "Database Error", data: {} });
                    return;
                }
                resolve({ code: 200, message: "Candidates listed successfully", data: { Candidates: results.rows } });
            })
        })
    }
