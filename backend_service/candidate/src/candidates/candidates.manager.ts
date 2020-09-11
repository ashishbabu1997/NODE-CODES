import candidateQuery from './query/candidates.query';
import database from '../common/database/database';
import { sendMail } from '../middlewares/mailer'
import config from '../config/config'

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
            const candidate = results.rows;
            let hiringStages = [];
            let result = {
                candidateFirstName: candidate[0].candidateFirstName,
                candidateLastName: candidate[0].candidateLastName,
                positionName: candidate[0].positionName,
                description: candidate[0].description,
                coverNote: candidate[0].coverNote,
                resume: candidate[0].resume,
                rate: _body.userRoleId == 1 ? candidate[0].rate : candidate[0].ellowRate,
                billingType: candidate[0].billingTypeId,
                currencyTypeId: candidate[0].currencyTypeId,
                phoneNumber: candidate[0].phoneNumber,
                label: candidate[0].label,
                emailAddress: candidate[0].emailAddress,
                hiringStages
            };
            _body.userRoleId == 1 && (result['ellowRate'] = candidate[0].ellowRate)
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
            selectQuery = selectQuery + " " + "AND ((LOWER(ca.candidate_first_name) LIKE '%" + _body.filter.toLowerCase() + "%') " + "OR ((LOWER(ca.candidate_last_name) LIKE '%" + _body.filter.toLowerCase() + "%') " + "OR (LOWER(c.company_name) LIKE '%" + _body.filter.toLowerCase() + "%')) "
        }

        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                const [adminHiringStages, adminApprovedCandidates] = _body.userRoleId == 1 ? [1, 0] : [0, 1];
                const listHiringStages = {
                    name: 'get-position-hiring-stages',
                    text: candidateQuery.getPositionHiringStages,
                    values: [_body.positionId, adminHiringStages]
                }
                const hiringStagesResult = await client.query(listHiringStages);
                let hiringStages = hiringStagesResult.rows;
                hiringStages = hiringStages.map(element => { return { ...element, candidateList: [] } })
                const listCandidates = {
                    name: 'get-position-candidates',
                    text: selectQuery,
                    values: [_body.positionId, adminApprovedCandidates]
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
export const candidateClearance = (_body) => {
    return new Promise((resolve, reject) => {
        var adminApproveStatus;
        var comment;
        var subj;
        var textFormat;
        var candidateFirstName;
        var candidateCompanyName;
        var candidateQueries;
        var makeOffer;
        var value;
        const getCandidateName = {
            name: 'get-candidate-names',
            text:candidateQuery.getCandidateNames,
            values:[_body.candidateId]
        }
        database().query(getCandidateName, (error, results) => {
            if (error) {
                console.log(error)
                reject({ code: 400, message: "Database Error", data: {} });
                return;
            }
        var firstName=results.rows[0].firstName
        var companyName=results.rows[0].companyName
        candidateFirstName=firstName.fontsize(3).bold()
        candidateCompanyName=companyName.fontsize(3).bold()    
        if (_body.decisionValue==1)
        {
            makeOffer=1
            if(_body.userRoleId==1)
            {
                adminApproveStatus=1
                comment=_body.comment
                value=[_body.candidateId,adminApproveStatus,comment,_body.elowRate,makeOffer]
                candidateQueries=candidateQuery.candidateSuperAdminApprovalQuery
            }
            else if(_body.userRoleId==2)
            {
                adminApproveStatus=1;
                comment=_body.comment;
                value=[_body.candidateId,adminApproveStatus,comment,makeOffer]
                candidateQueries=candidateQuery.candidateAdminApprovalQuery
                subj="Candidate Approval Mail";
                textFormat=config.approvalMail.firstLine+config.nextLine+candidateFirstName+" "+"from"+" "+candidateCompanyName+config.approvalMail.secondLine+config.nextLine+config.approvalMail.thirdLine+config.nextLine+config.approvalMail.fourthLine
                console.log(textFormat)
                sendMail(config.adminEmail, subj, textFormat, function (err, data) {
                    if (err) {
                        console.log(err)
                        reject({ code: 400, message: "Database Error", data: {} });
                        return;
                    }
                    console.log('Admin Approval Mail has been sent !!!');
                });
            }   
        
        }
        else
        {
            makeOffer=0
            if(_body.userRoleId==1)
            {
                adminApproveStatus=0
                comment=_body.comment
                value=[_body.candidateId,adminApproveStatus,comment,_body.elowRate,makeOffer]
                candidateQueries=candidateQuery.candidateSuperAdminApprovalQuery
            }
            else if(_body.userRoleId==2)
            {
                adminApproveStatus=0;
                comment=_body.comment;
                value=[_body.candidateId,adminApproveStatus,comment,makeOffer]
                candidateQueries=candidateQuery.candidateAdminApprovalQuery
                subj="Candidate Rejection Mail";
                textFormat=config.rejectionMail.firstLine+config.nextLine+candidateFirstName+" "+"from"+" "+candidateCompanyName+config.rejectionMail.secondLine+config.nextLine+config.rejectionMail.thirdLine+config.nextLine+config.rejectionMail.fourthLine
                sendMail(config.adminEmail, subj, textFormat, function (err, data) {
                    if (err) {
                        console.log(err)
                        reject({ code: 400, message: "Database Error", data: {} });
                        return;
                    }
                    console.log('Candidate Rejection Mail has been sent !!!');
                });
            }  

        }
        const candidateApprovalQuery = {
            name: 'admin',
            text:candidateQueries,
            values:value
        }
        database().query(candidateApprovalQuery, (error, results) => {
            if (error) {
                console.log(error)
                reject({ code: 400, message: "Database Error", data: {} });
                return;
            }
            resolve({ code: 200, message: "Candidate Clearance Successsfull", data: {} });

            // resolve({ code: 200, message: "Users listed successfully", data: { Users: results.rows } });
        })
    })

    })
}