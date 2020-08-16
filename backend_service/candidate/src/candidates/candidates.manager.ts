import candidateQuery from './query/candidates.query';
import database from '../common/database/database';
import {Promise} from "es6-promise";
export const getCandidateDetails = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
                name: 'get-candidate-details',
                text: candidateQuery.listCandidateDetails,
                values: [_body.candidateId],
            }
            database().query(query, (error, results) => {
                if (error) {
                    reject({ code: 400, message: "Failed to save to database", data: {} });
                    return;
                }
                resolve({ code: 200, message: "Candidate details listed successfully", data: {candidate:results.rows} });
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
            console.log(selectQuery)
            const listquery = {
                name: 'list-candidates',
                text:selectQuery,
                values:[_body.positionId]
            }
            database().query(listquery, (error, results) => {
                if (error) {
                    console.log(error, "eror")
                    reject({ code: 400, message: "Failed to save to the database", data: {} });
                    return;
                }
                resolve({ code: 200, message: "Candidates listed successfully", data: { Candidates: results.rows } });
            })
        })
    }
