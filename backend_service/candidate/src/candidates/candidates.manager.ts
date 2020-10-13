import candidateQuery from './query/candidates.query';
import database from '../common/database/database';
import { sendMail } from '../middlewares/mailer'
import config from '../config/config';
import { createNotification } from '../common/notifications/notifications';

export const getCandidateDetails = (_body) => {
    return new Promise((resolve, reject) => {
        const query = {
            name: 'get-candidate-details',
            text: candidateQuery.getCandidateDetails,
            values: [_body.candidateId],
        }
        database().query(query, (error, results) => {
            if (error) {
                console.log(error)
                reject({ code: 400, message: "Database Error", data: {} });
                return;
            }
            const candidate = results.rows;
            const positionId = candidate[0].positionId
            console.log(positionId)
            const getCandidateAssessmentTraitsQuery = {
                name: 'get-candidate-assessmentTraits',
                text: candidateQuery.getAssessmentTraits,
                values: [_body.candidateId, positionId],
            }
            database().query(getCandidateAssessmentTraitsQuery, (error, value) => {
                let hiringStages = [];
                let assessmentTraits = value.rows                
                if(_body.admin!=1 && Array.isArray(assessmentTraits) && assessmentTraits.length>0)
                {
                    let flag=false;
                    assessmentTraits.forEach(element => {
                        element.adminRating!=null && element.adminRating>0?flag=true:"";
                    });
                    if(!flag)
                    {
                        assessmentTraits=null;
                    }
                }
                let result = {
                    makeOffer: candidate[0].makeOffer,
                    adminApproveStatus: candidate[0].adminApproveStatus,
                    candidateFirstName: candidate[0].candidateFirstName,
                    candidateLastName: candidate[0].candidateLastName,
                    companyName: candidate[0].companyName,
                    companyId: candidate[0].companyId,
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
                    assessmentComment: candidate[0].assessmentComment,
                    hiringStages,
                    assessmentTraits
                };
                _body.userRoleId == 1 && (result['ellowRate'] = candidate[0].ellowRate)
                candidate.forEach(step => {
                    hiringStages.push({
                        hiringStageName: step.hiringStageName,
                        hiringStatus: step.hiringStatus,
                        hiringStageOrder: step.hiringStageOrder
                    })
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

                const getJobReceivedId = {
                    name: 'get-jobreceived-id',
                    text: candidateQuery.getJobReceivedId,
                    values: [_body.positionId]
                }
                const jobReceivedIdResult = await client.query(getJobReceivedId);
                var jobReceivedId = jobReceivedIdResult.rows[0]['job_received_id'];

                await client.query('COMMIT')
                resolve({ code: 200, message: "Candidate Listed successfully", data: { companyName, positionName, jobReceivedId, hiringStages, allCandidates } });
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
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                var adminApproveStatus;
                var comment;
                var subj;
                var textFormat;
                var candidateQueries;
                var makeOffer;
                var value;
                const getCandidateName = {
                    name: 'get-candidate-names',
                    text: candidateQuery.getCandidateNames,
                    values: [_body.candidateId]
                }
                const results = await client.query(getCandidateName);
                const candidateDetails = results.rows[0];
                const { firstName, lastName, positionId, jobReceivedId, companyName, positionName } = candidateDetails;
                let message = ``
                let candidateFirstName = firstName.fontsize(3).bold()
                let candidateCompanyName = companyName.fontsize(3).bold()
                if (_body.decisionValue == 1) {
                    if (_body.userRoleId == 1) {
                        adminApproveStatus = 1
                        comment = _body.comment
                        value = [_body.candidateId, adminApproveStatus, comment, _body.ellowRate,_body.userId]
                        candidateQueries = candidateQuery.candidateSuperAdminApprovalQuery
                    }
                    else if (_body.userRoleId == 2) {
                        message = `${firstName + ' ' + lastName} from ${companyName} has been selected for the position:${positionName}`;
                        var approveMessage=firstName.fontsize(3).bold()+'  '+lastName.fontsize(3).bold()+'   '+'from'+'   '+companyName.fontsize(3).bold()+'   '+'has been selected for the position'+'   '+positionName.fontsize(3).bold()
                        makeOffer = 1
                        adminApproveStatus = 1;
                        comment = _body.comment;
                        value = [_body.candidateId, adminApproveStatus, comment, makeOffer,_body.userId]
                        candidateQueries = candidateQuery.candidateAdminApprovalQuery
                        subj = "Candidate Selection Mail";
                        textFormat = config.approvalMail.firstLine + config.nextLine+config.nextLine + approveMessage+config.nextLine+config.nextLine+config.approvalMail.thirdLine+config.nextLine+config.approvalMail.fourthLine
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
                } else {
                    if (_body.userRoleId == 1) {
                        adminApproveStatus = 0
                        comment = _body.comment
                        value = [_body.candidateId, adminApproveStatus, comment,_body.userId]
                        candidateQueries = candidateQuery.candidateSuperAdminRejectQuery
                    } else if (_body.userRoleId != 1) {
                        var rejectMessage=firstName.fontsize(3).bold()+'   '+lastName.fontsize(3).bold()+'   '+'from'+'   '+companyName.fontsize(3).bold()+'   '+'has been rejected for the position'+'   '+positionName.fontsize(3).bold()
                        message = `${firstName + ' ' + lastName} from ${companyName} has been rejected for the position:- ${positionName}`;
                        makeOffer = 0
                        adminApproveStatus = 1;
                        comment = _body.comment;
                        value = [_body.candidateId, adminApproveStatus, comment, makeOffer,_body.userId]
                        candidateQueries = candidateQuery.candidateAdminApprovalQuery
                        subj = "Candidate Rejection Mail";
                        textFormat = config.rejectionMail.firstLine+ config.nextLine + config.nextLine+rejectMessage+config.nextLine+config.nextLine+config.rejectionMail.thirdLine+config.nextLine+config.rejectionMail.fourthLine
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
                await client.query(candidateApprovalQuery);
                await client.query('COMMIT');
                _body.userRoleId != 1 && await createNotification({ positionId, jobReceivedId, companyId: _body.companyId, message, candidateId: _body.candidateId, notificationType: 'candidate' });
                // sendMail(config.adminEmail, subj, textFormat, (err, data) => {
                //     if (err) {
                //         console.log(err)
                //         reject({ code: 400, message: "Database Error", data: {} });
                //         return;
                //     }
                    resolve({ code: 200, message: "Candidate Clearance Successsfull", data: {} });
                // });
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

export const interviewRequestFunction = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                const insertQuery = {
                    name: 'insert-make-offer-status',
                    text: candidateQuery.insertMakeOfferStatus,
                    values: [_body.candidateId,_body.userId],
                }
                await client.query(insertQuery);
                const candidateDetails = {
                    name: 'get-interview-details',
                    text: candidateQuery.getInterviewDetails,
                    values: [_body.candidateId, _body.companyId],
                }
                const result = await client.query(candidateDetails);
                await client.query('COMMIT');
                var interviewDetails = result.rows
                let { positionId, jobReceivedId, candidateFirstName, candidateLastName } = interviewDetails[0];
                const message = `An interview request has been received for the candidate ${candidateFirstName + ' ' + candidateLastName}.`
                await createNotification({ positionId, jobReceivedId, companyId: _body.companyId, message, candidateId: _body.candidateId, notificationType: 'candidate' })
                var hirerCompanyName = interviewDetails[0].hirerCompanyName.toUpperCase()
                var hirerCompanyNameHtml = hirerCompanyName.fontsize(3).bold()
                candidateFirstName = interviewDetails[0].candidateFirstName === null ? '' : interviewDetails[0].candidateFirstName.fontsize(3).bold()
                var positionName = interviewDetails[0].positionName === null ? '' : interviewDetails[0].positionName.fontsize(3).bold()
                var email = interviewDetails[0].emailAddress === null ? '' : interviewDetails[0].emailAddress.fontsize(3).bold()
                var phoneNumber = interviewDetails[0].phoneNumber === null ? '' : interviewDetails[0].phoneNumber.fontsize(3).bold()
                // var description = interviewDetails[0].description === null ? '' : interviewDetails[0].description.fontsize(3).bold()
                var subject = "Request for Interview from " + hirerCompanyName;
                var textFormat = hirerCompanyNameHtml + config.space + config.RequestText.firstLine.fontsize(3).bold() + config.break + config.RequestText.secondLine.fontsize(3).bold() + config.space + candidateFirstName + config.break + config.RequestText.thirdLine.fontsize(3).bold() + config.space + positionName + config.break + config.RequestText.fourthLine.fontsize(3).bold() + config.space + email + config.break + config.RequestText.fifthLine.fontsize(3).bold() + config.space + phoneNumber + config.break + config.RequestText.sixthLine.fontsize(3).bold() + config.break+config.break+config.RequestText.seventhLine.fontsize(3).bold()+config.break+config.RequestText.eigthLine.fontsize(3).bold()
                sendMail(config.adminEmail, subject, textFormat, function (err, data) {
                    if (err) {
                        console.log(err)
                        reject({ code: 400, message: "Email Error", data: {} });
                        return;
                    }
                });
                resolve({ code: 200, message: "Interview request has been sent successfully", data: {} });
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

export const addCandidateReview = (_body) => {
    return new Promise((resolve, reject) => {
        const data = _body.assessmentTraits;
        const currentTime = Math.floor(Date.now() / 1000);
        let promise = [];
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                const insertQuery = {
                    name: 'insert-assessment-comment',
                    text: candidateQuery.updateAssessmentComment,
                    values: [_body.candidateId, _body.assessmentComment],
                }
                promise.push(client.query(insertQuery));

                data.forEach(element => {
                    const candidateDetails = {
                        name: 'update-candidate-assesment-rating',
                        text: candidateQuery.updateCandidateAssesment,
                        values: [element.candidateAssesmentId, element.assessmentRating, _body.employeeId, currentTime],
                    }
                    promise.push(client.query(candidateDetails));
                });
                const results = await Promise.all(promise);
                await client.query('COMMIT')
                resolve({ code: 200, message: "Candidate Assesment Updated successfully", data: {} });

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