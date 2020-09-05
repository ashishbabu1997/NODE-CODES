import candidateQuery from './query/candidates.query';
import database from '../common/database/database';

export const getCandidateDetails = (_body) => {
    return new Promise((resolve, reject) => {
        const query = {
            name: 'get-candidate-details',
            text: candidateQuery.getCandidateDetails,
            values: [_body.candidateId],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Database Error", data: {} });
                return;
            }
            const candidate = results.rows
            console.log(candidate)
            let hiringStages = [];
            let result = {
                candidateName: candidate[0].candidateName,
                companyName: candidate[0].companyName,
                positionName: candidate[0].positionName,
                description: candidate[0].description,
                coverNote: candidate[0].coverNote,
                resume: candidate[0].resume,
                rate: candidate[0].rate,
                phoneNumber: candidate[0].phoneNumber,
                label: candidate[0].label,
                emailAddress: candidate[0].emailAddress,
                candidateStatus: candidate[0].candidateStatus,
                hiringStages
            };
            candidate.forEach(step => {
                hiringStages.push({
                    hiringStageName: step.hiringStageName,
                    hiringStatus: step.hiringStatus,
                    hiringStageOrder: step.hiringStageOrder
                })
                resolve({ code: 200, message: "Candidate details listed successfully", data: result });
            })
        })
    })
}
export const listCandidatesDetails = (_body) => {
    return new Promise((resolve, reject) => {
        var selectQuery = candidateQuery.listCandidates;
        if (_body.filter) {
            selectQuery = selectQuery + " " + "AND ((LOWER(ca.candidate_name) LIKE '%" + _body.filter.toLowerCase() + "%') " + "OR (LOWER(c.company_name) LIKE '%" + _body.filter.toLowerCase() + "%')) "
        }

        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                const listHiringStages = {
                    name: 'get-position-hiring-stages',
                    text: candidateQuery.getPositionHiringStages,
                    values: [_body.positionId]
                }
                const hiringStagesResult = await client.query(listHiringStages);
                let hiringStages = hiringStagesResult.rows;
                // hiringStages.push({ positionHiringStageId: null, positionHiringStageName: 'applied candidates' })
                hiringStages = hiringStages.map(element => { return { ...element, candidateList: [] } })
                const listCandidates = {
                    name: 'get-position-candidates',
                    text: selectQuery,
                    values: [_body.positionId]
                }
                const candidatesResult = await client.query(listCandidates);
                let candidates = candidatesResult.rows
                let allCandidates = [];
                candidates.forEach(candidate => {
                    let index = hiringStages.findIndex(e => e.positionHiringStageId == candidate.currentHiringStageId)
                    let candidateIndex = allCandidates.findIndex(c => c.candidateId == candidate.candidateId)
                    if (candidate.candidateStatus != 0 && candidate.currentHiringStageId != null) {
                        hiringStages[index]['candidateList'].push(candidate);
                    }
                    if (candidate.candidateStatus != 0 && candidateIndex == -1) {
                        allCandidates.push(candidate);
                    }
                });
                await client.query('COMMIT')
                resolve({ code: 200, message: "Candidate Listed successfully", data: { hiringStages, allCandidates } });
            } catch (e) {
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
