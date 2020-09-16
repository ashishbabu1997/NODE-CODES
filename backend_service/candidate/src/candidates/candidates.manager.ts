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
                makeOffer: candidate[0].makeOffer,
                adminApproveStatus: candidate[0].adminApproveStatus,
                candidateFirstName: candidate[0].candidateFirstName,
                candidateLastName: candidate[0].candidateLastName,
                companyName: candidate[0].companyName,
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
        if (_body.userRoleId != 1) {
            selectQuery = selectQuery + " AND ca.admin_approve_status = 1"
        }
        if (_body.filter) {
            selectQuery = selectQuery + " " + "AND ((LOWER(ca.candidate_first_name) LIKE '%" + _body.filter.toLowerCase() + "%') " + "OR (LOWER(ca.candidate_last_name) LIKE '%" + _body.filter.toLowerCase() + "%') " + "OR (LOWER(c.company_name) LIKE '%" + _body.filter.toLowerCase() + "%')) "
        }
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                const adminHiringStages = _body.userRoleId == 1 ? 1 : 0;
                const listHiringStages = {
                    name: 'get-position-hiring-stages',
                    text: candidateQuery.getPositionHiringStages,
                    values: [_body.positionId, adminHiringStages]
                }
                const hiringStagesResult = await client.query(listHiringStages);
                let hiringStages = hiringStagesResult.rows;

                const { companyName, positionName } = hiringStages[0];
                hiringStages = hiringStages.map(element => { return { ...element, candidateList: [] } })
                const listCandidates = {
                    name: 'get-position-candidates',
                    text: selectQuery,
                    values: [_body.positionId]
                }
                const candidatesResult = await client.query(listCandidates);
                let candidates = candidatesResult.rows;

                console.log(companyName, "dasdas")
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
                resolve({ code: 200, message: "Candidate Listed successfully", data: { companyName, positionName, hiringStages, allCandidates } });
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
            text: candidateQuery.getCandidateNames,
            values: [_body.candidateId]
        }
        database().query(getCandidateName, (error, results) => {
            if (error) {
                console.log(error)
                reject({ code: 400, message: "Database Error", data: {} });
                return;
            }
            var firstName = results.rows[0].firstName
            var companyName = results.rows[0].companyName
            candidateFirstName = firstName.fontsize(3).bold()
            candidateCompanyName = companyName.fontsize(3).bold()
            if (_body.decisionValue == 1) {
                if (_body.userRoleId == 1) {
                    adminApproveStatus = 1
                    comment = _body.comment
                    value = [_body.candidateId, adminApproveStatus, comment, _body.elowRate]
                    candidateQueries = candidateQuery.candidateSuperAdminApprovalQuery
                }
                else if (_body.userRoleId == 2) {
                    makeOffer = 1
                    adminApproveStatus = 1;
                    comment = _body.comment;
                    value = [_body.candidateId, adminApproveStatus, comment, makeOffer]
                    candidateQueries = candidateQuery.candidateAdminApprovalQuery
                    subj = "Candidate Approval Mail";
                    textFormat = config.approvalMail.firstLine + config.nextLine + candidateFirstName + " " + "from" + " " + candidateCompanyName + config.approvalMail.secondLine + config.nextLine + config.approvalMail.thirdLine + config.nextLine + config.approvalMail.fourthLine
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
            else {
                makeOffer = 0
                if (_body.userRoleId == 1) {
                    adminApproveStatus = 0
                    comment = _body.comment
                    value = [_body.candidateId, adminApproveStatus, comment]
                    candidateQueries = candidateQuery.candidateSuperAdminRejectQuery
                }
                else if (_body.userRoleId == 2) {
                    adminApproveStatus = 0;
                    comment = _body.comment;
                    value = [_body.candidateId, adminApproveStatus, comment, makeOffer]
                    candidateQueries = candidateQuery.candidateAdminApprovalQuery
                    subj = "Candidate Rejection Mail";
                    textFormat = config.rejectionMail.firstLine + config.nextLine + candidateFirstName + " " + "from" + " " + candidateCompanyName + config.rejectionMail.secondLine + config.nextLine + config.rejectionMail.thirdLine + config.nextLine + config.rejectionMail.fourthLine
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
                text: candidateQueries,
                values: value
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
export const interviewRequestFunction = (_body) => {
    return new Promise((resolve, reject) => {
        const insertQuery = {
            name: 'insert-make-offer-status',
            text: candidateQuery.insertMakeOfferStatus,
            values: [_body.candidateId],
        }
        database().query(insertQuery, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Database Error", data: {} });
                return;
            }
        })
        const candidateDetails = {
            name: 'insert-make-offer-status',
            text: candidateQuery.getInterviewDetails,
            values: [_body.candidateId, _body.companyId],
        }
        database().query(candidateDetails, (error, result) => {
            if (error) {
                console.log(error);
                reject({ code: 400, message: "Database Error", data: {} });
                return;
            }
            var interviewDetails = result.rows
            var hirerCompanyName = interviewDetails[0].hirerCompanyName.toUpperCase()
            var hirerCompanyNameHtml = hirerCompanyName.fontsize(3).bold()
            var candidateFirstName = interviewDetails[0].candidateFirstName.fontsize(3).bold()
            var positionName = interviewDetails[0].positionName.fontsize(3).bold()
            var email = interviewDetails[0].emailAddress.fontsize(3).bold()
            var phoneNumber = interviewDetails[0].phoneNumber.fontsize(3).bold()
            var description = interviewDetails[0].description.fontsize(3).bold()
            var subject = "Request for Interview from " + hirerCompanyName;
            var textFormat = hirerCompanyNameHtml + config.space + config.RequestText.firstLine.fontsize(3).bold() + config.break + config.RequestText.secondLine.fontsize(3).bold() + config.space + candidateFirstName + config.break + config.RequestText.thirdLine.fontsize(3).bold() + config.space + positionName + config.break + config.RequestText.fourthLine.fontsize(3).bold() + config.space + email + config.break + config.RequestText.fifthLine.fontsize(3).bold() + config.space + phoneNumber + config.break + config.RequestText.sixthLine.fontsize(3).bold() + config.space + description
            sendMail(config.adminEmail, subject, textFormat, function (err, data) {
                if (err) {
                    console.log(err)
                    reject({ code: 400, message: "Email Error", data: {} });
                    return;
                }
            });
            resolve({ code: 200, message: "Interview request has been sent successfully", data: {} });
        })
    })

}