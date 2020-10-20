import candidateQuery from './query/candidates.query';
import database from '../common/database/database';
import { sendMail } from '../middlewares/mailer'
import config from '../config/config';
import { createNotification } from '../common/notifications/notifications';
import * as handlebars from 'handlebars'
import * as fs from 'fs'


export const getCandidateDetails = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database().connect()
            try {
                let skills = null, topRatedSkill = [], otherSkill = [];

                await client.query('BEGIN');
                const listCandidateQuery = {
                    name: 'get-candidate-details',
                    text: candidateQuery.getCandidateDetails,
                    values: [_body.candidateId],
                }
                let results = await client.query(listCandidateQuery);
                const candidate = results.rows;
                const positionId = candidate[0].positionId
                // console.log(positionId)
                const getCandidateAssessmentTraitsQuery = {
                    name: 'get-candidate-assessmentTraits',
                    text: candidateQuery.getAssessmentTraits,
                    values: [_body.candidateId],
                }
                let value = await client.query(getCandidateAssessmentTraitsQuery);

                let assessmentTraits = value.rows
                if (_body.admin != 1 && Array.isArray(assessmentTraits) && assessmentTraits.length >= 0) {
                    let flag = false;
                    assessmentTraits.forEach(element => {
                        element.adminRating != null && element.adminRating > 0 ? flag = true : "";
                    });
                    if (!flag) {
                        assessmentTraits = null;
                    }

                }

                const getCandidateSkillsQuery = {
                    name: 'get-candidate-skills',
                    text: candidateQuery.getCandidateSkills,
                    values: [_body.candidateId],
                }
                let skillResult = await client.query(getCandidateSkillsQuery);
                skillResult.rows.forEach(step => {
                    if (step.skillId != null) {
                        step.topSkill ?
                            topRatedSkill.push(
                                {
                                    skillId: step.skillId,
                                    skillName: step.skillName
                                }
                            ) :
                            otherSkill.push(
                                {
                                    skillId: step.skillId,
                                    skillName: step.skillName
                                }
                            );
                    }
                });

                skills = { topRatedSkill, otherSkill };


                let result = {
                    makeOffer: candidate[0].makeOffer,
                    adminApproveStatus: candidate[0].adminApproveStatus,
                    firstName: candidate[0].firstName,
                    lastName: candidate[0].lastName,
                    companyName: candidate[0].companyName,
                    companyId: candidate[0].companyId,
                    positionName: candidate[0].positionName,
                    description: candidate[0].description,
                    candidateStatus: candidate[0].candidateStatus,
                    coverNote: candidate[0].coverNote,
                    resume: candidate[0].resume,
                    rate: candidate[0].rate,
                    ellowRate: candidate[0].ellowRate,
                    billingTypeId: candidate[0].billingTypeId,
                    currencyTypeId: candidate[0].currencyTypeId,
                    phoneNumber: candidate[0].phoneNumber,
                    label: candidate[0].label,
                    email: candidate[0].email,
                    workExperience: candidate[0].workExperience,
                    assessmentComment: candidate[0].assessmentComment,
                    assessmentTraits,
                    skills
                };
                _body.userRoleId == 1 && (result['ellowRate'] = candidate[0].ellowRate)

                resolve({ code: 200, message: "Candidate details listed successfully", data: result });
                await client.query('COMMIT')
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
export const listCandidatesDetails = (_body) => {
    return new Promise((resolve, reject) => {
        var selectQuery = candidateQuery.listCandidates;
        if (_body.userRoleId != 1) {
            selectQuery = selectQuery + " AND cp.admin_approve_status = 1"
        }
        const orderBy = {
            "updatedOn": 'ca.updated_on'
        }

        if (_body.filter) {
            selectQuery = selectQuery + " AND ((LOWER(ca.candidate_first_name) LIKE '%" + _body.filter.toLowerCase() + "%') " + "OR (LOWER(ca.candidate_last_name) LIKE '%" + _body.filter.toLowerCase() + "%') " + "OR (LOWER(c.company_name) LIKE '%" + _body.filter.toLowerCase() + "%')) "
        }
        selectQuery = selectQuery + ' ORDER BY ' + orderBy[_body.sortBy] + ' ' + _body.sortType
            // let orderBy = 'ORDER BY ca.updated_on desc';


            (async () => {
                const client = await database().connect()
                try {
                    await client.query('BEGIN');
                    const listCandidates = {
                        name: 'get-position-candidates',
                        text: selectQuery,
                        values: [_body.positionId, _body.employeeId]
                    }
                    const candidatesResult = await client.query(listCandidates);
                    let candidates = candidatesResult.rows;
                    let allCandidates = [];
                    candidates.forEach(candidate => {
                        let candidateIndex = allCandidates.findIndex(c => c.candidateId == candidate.candidateId)
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
                    resolve({ code: 200, message: "Candidate Listed successfully", data: { jobReceivedId, allCandidates } });
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

export const listFreeCandidatesDetails = (_body) => {
    return new Promise((resolve, reject) => {
        var selectQuery = candidateQuery.listFreeCandidates;
        if (_body.userRoleId != 1) {
            selectQuery = selectQuery + " AND c.company_id = " + _body.companyId
        }
        else {
            selectQuery = selectQuery + " AND ca.candidate_status = 3"
        }
        if (_body.filter) {
            selectQuery = selectQuery + " " + "AND (ca.candidate_first_name ilike '%" + _body.filter + "%' or ca.candidate_last_name ilike '%" + _body.filter + "%' or c.company_name ilike '%" + _body.filter + "%')"
        }

        const orderBy = {
            "candidateId": 'ca.candidate_id'
        }

        selectQuery = selectQuery + ' ORDER BY ' + orderBy[_body.sortBy] + ' ' + _body.sortType

        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                const listCandidates = {
                    name: 'get-free-candidates',
                    text: selectQuery
                }
                const candidatesResult = await client.query(listCandidates);
                let candidates = candidatesResult.rows;

                await client.query('COMMIT')
                resolve({ code: 200, message: "Candidate Listed successfully", data: { candidates } });
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
        const currentTime = Math.floor(Date.now() / 1000);
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                var readHTMLFile = function (path, callback) {
                    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
                        if (err) {
                            throw err;
                            callback(err);
                        }
                        else {
                            callback(null, html);
                        }
                    });
                };
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
                    values: [_body.candidateId, _body.positionId]
                }
                const results = await client.query(getCandidateName);
                const candidateDetails = results.rows[0];
                const { firstName, lastName, jobReceivedId, companyName, positionName } = candidateDetails;
                let message = ``
                let candidateFirstName = firstName.fontsize(3).bold()
                let candidateCompanyName = companyName.fontsize(3).bold()
                if (_body.decisionValue == 1) {
                    if (_body.userRoleId == 1) {
                        adminApproveStatus = 1
                        comment = _body.comment
                        value = [_body.candidateId, _body.positionId, adminApproveStatus, comment, _body.ellowRate, _body.employeeId, currentTime]
                        candidateQueries = candidateQuery.candidateSuperAdminApprovalQuery
                    }
                    else if (_body.userRoleId == 2) {
                        message = `${firstName + ' ' + lastName} from ${companyName} has been selected for the position:${positionName}`;
                        var approveMessage = firstName.fontsize(3).bold() + '  ' + lastName.fontsize(3).bold() + '   ' + 'from' + '   ' + companyName.fontsize(3).bold() + '   ' + 'has been selected for the position' + '   ' + positionName.fontsize(3).bold()
                        makeOffer = 1
                        adminApproveStatus = 1;
                        comment = _body.comment;
                        value = [_body.candidateId, _body.positionId, adminApproveStatus, comment, makeOffer, _body.employeeId, currentTime]
                        candidateQueries = candidateQuery.candidateAdminApprovalQuery
                        subj = "Candidate Selection Mail";
                        readHTMLFile('src/emailTemplates/selectionMailText.html', function (err, html) {
                            var template = handlebars.compile(html);
                            var replacements = {
                                fName: firstName,
                                lName: lastName,
                                cName: companyName,
                                pName: positionName
                            };
                            var htmlToSend = template(replacements);
                            sendMail(config.adminEmail, subj, htmlToSend, function (err, data) {
                                if (err) {
                                    console.log(err)
                                    reject({ code: 400, message: "Database Error", data: {} });
                                    return;
                                }
                                console.log('Admin Approval Mail has been sent !!!');
                            });
                        })
                    }
                } else {
                    if (_body.userRoleId == 1) {
                        adminApproveStatus = 0
                        comment = _body.comment
                        value = [_body.candidateId, _body.positionId, adminApproveStatus, comment, _body.employeeId, currentTime]
                        candidateQueries = candidateQuery.candidateSuperAdminRejectQuery
                    } else if (_body.userRoleId != 1) {
                        var rejectMessage = firstName.fontsize(3).bold() + '   ' + lastName.fontsize(3).bold() + '   ' + 'from' + '   ' + companyName.fontsize(3).bold() + '   ' + 'has been rejected for the position' + '   ' + positionName.fontsize(3).bold()
                        message = `${firstName + ' ' + lastName} from ${companyName} has been rejected for the position ${positionName}`;
                        makeOffer = 0
                        adminApproveStatus = 1;
                        comment = _body.comment;
                        value = [_body.candidateId, _body.positionId, adminApproveStatus, comment, makeOffer, _body.employeeId, currentTime]
                        candidateQueries = candidateQuery.candidateAdminApprovalQuery
                        subj = "Candidate Rejection Mail";
                        readHTMLFile('src/emailTemplates/rejectionMailText.html', function (err, html) {
                            var template = handlebars.compile(html);
                            var replacements = {
                                fName: firstName,
                                lName: lastName,
                                cName: companyName,
                                pName: positionName
                            };
                            var htmlToSend = template(replacements);
                            sendMail(config.adminEmail, subj, htmlToSend, function (err, data) {
                                if (err) {
                                    console.log(err)
                                    reject({ code: 400, message: "Database Error", data: {} });
                                    return;
                                }
                                console.log('Candidate Rejection Mail has been sent !!!');
                            });
                        })
                    }

                }
                const candidateApprovalQuery = {
                    name: 'admin',
                    text: candidateQueries,
                    values: value
                }
                await client.query(candidateApprovalQuery);
                await client.query('COMMIT');
                _body.userRoleId != 1 && await createNotification({ positionId: _body.positionId, jobReceivedId, companyId: _body.companyId, message, candidateId: _body.candidateId, notificationType: 'candidate' });
                resolve({ code: 200, message: "Candidate Clearance Successsfull", data: {} });

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
        const currentTime = Math.floor(Date.now() / 1000);
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                var readHTMLFile = function (path, callback) {
                    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
                        if (err) {
                            throw err;
                            callback(err);
                        }
                        else {
                            callback(null, html);
                        }
                    });
                };
                const insertQuery = {
                    name: 'insert-make-offer-status',
                    text: candidateQuery.insertMakeOfferStatus,
                    values: [_body.candidateId, _body.positionId, _body.employeeId, currentTime],
                }
                await client.query(insertQuery);
                const candidateDetails = {
                    name: 'get-interview-details',
                    text: candidateQuery.getInterviewDetails,
                    values: [_body.candidateId, _body.companyId, _body.positionId],
                }
                const result = await client.query(candidateDetails);
                await client.query('COMMIT');
                var interviewDetails = result.rows

                let { jobReceivedId, candidateFirstName, candidateLastName } = interviewDetails[0];

                const message = `An interview request has been received for the candidate ${candidateFirstName + ' ' + candidateLastName}.`
                await createNotification({ positionId: _body.positionId, jobReceivedId, companyId: _body.companyId, message, candidateId: _body.candidateId, notificationType: 'candidate' })

                var hirerCompanyName = interviewDetails[0].hirerCompanyName.toUpperCase()
                candidateFirstName = interviewDetails[0].candidateFirstName === null ? '' : interviewDetails[0].candidateFirstName
                candidateLastName = interviewDetails[0].candidateLastName === null ? '' : interviewDetails[0].candidateLastName
                var positionName = interviewDetails[0].positionName === null ? '' : interviewDetails[0].positionName
                var email = interviewDetails[0].emailAddress === null ? '' : interviewDetails[0].emailAddress
                var phoneNumber = interviewDetails[0].phoneNumber === null ? '' : interviewDetails[0].phoneNumber
                // var description = interviewDetails[0].description === null ? '' : interviewDetails[0].description.fontsize(3).bold()
                var subject = "Request for Interview from " + hirerCompanyName;
                readHTMLFile('src/emailTemplates/interviewRequestMailText.html', function (err, html) {
                    var template = handlebars.compile(html);
                    var replacements = {
                        hirerName: hirerCompanyName,
                        firstName: candidateFirstName,
                        lastName: candidateLastName,
                        position: positionName,
                        emailId: email,
                        telephoneNumber: phoneNumber
                    };
                    var htmlToSend = template(replacements);
                    sendMail(config.adminEmail, subject, htmlToSend, function (err, data) {
                        if (err) {
                            console.log(err)
                            reject({ code: 400, message: "Email Error", data: {} });
                            return;
                        }
                    });
                })
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
                        values: [element.assesmentId, element.adminRating, _body.employeeId, currentTime],
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

export const editVettingStatus = (_body) => {
    return new Promise((resolve, reject) => {
        const candidateId = _body.candidateId;
        const vettingStatus = _body.candidateVetted;
        const currentTime = Math.floor(Date.now() / 1000);
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                const updateQuery = {
                    name: 'update-candidate-vetting',
                    text: candidateQuery.updateCandidateVetting,
                    values: [candidateId, vettingStatus, _body.employeeId, currentTime],
                }

                await client.query(updateQuery);
                await client.query('COMMIT')
                resolve({ code: 200, message: "Candidate Vetting Updated successfully", data: {} });

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


export const removeCandidateFromPosition = (_body) => {
    return new Promise((resolve, reject) => {
        const candidateId = _body.candidateId;
        const positionId = _body.positionId;
        var positionName;
        var hirerName;
        const currentTime = Math.floor(Date.now() / 1000);
        (async () => {
            const client = await database().connect()
            try {
                var readHTMLFile = function (path, callback) {
                    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
                        if (err) {
                            throw err;
                            callback(err);
                        }
                        else {
                            callback(null, html);
                        }
                    });
                };
                console.log(candidateId, positionId)
                await client.query('BEGIN');
                const removeCandidateQuery = {
                    name: 'delete-candidate-from-position',
                    text: candidateQuery.deleteCandidateFromPosition,
                    values: [candidateId, positionId, _body.employeeId, currentTime],
                }
                await client.query(removeCandidateQuery);
                await client.query('COMMIT')
                const getPositionDetails = {
                    name: 'delete-position-details',
                    text: candidateQuery.getPositionDetails,
                    values: [positionId],
                }
                database().query(getPositionDetails, (error, results) => {
                    if (error) {
                        console.log("DB1", error)
                        reject({ code: 400, message: "Failed. Please try again.", data: {} });
                        return;
                    }
                    else {
                        positionName = results.rows[0].positionName
                        hirerName = results.rows[0].hirerName
                    }
                })
                const getSellerEmailQuery = {
                    name: 'delete-candidate-from-position',
                    text: candidateQuery.getSellerMail,
                    values: [candidateId],
                }
                database().query(getSellerEmailQuery, (error, results) => {
                    if (error) {
                        console.log("DB2", error)
                        reject({ code: 400, message: "Failed. Please try again.", data: {} });
                        return;
                    }
                    var candidateFirstName = results.rows[0].cFirstName
                    var candidateLastName = results.rows[0].cLastName
                    var sellerMail = results.rows[0].email
                    var subject = "Candidate Deletion Notification";
                    readHTMLFile('src/emailTemplates/candidateDeletionMailText.html', function (err, html) {
                        var template = handlebars.compile(html);
                        var replacements = {
                            hName: hirerName,
                            pName: positionName,
                            cfirstName: candidateFirstName,
                            clastName: candidateLastName
                        };
                        var htmlToSend = template(replacements);
                        sendMail(sellerMail, subject, htmlToSend, function (err, data) {
                            if (err) {
                                console.log("mailer", err)
                                reject({ code: 400, message: "Email Error", data: {} });
                                return;
                            }
                        })
                    })
                })
                resolve({ code: 200, message: "Candidate deleted successfully", data: {} });

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

export const linkCandidateWithPosition = (_body) => {
    return new Promise((resolve, reject) => {
        const candidateList = _body.candidates;
        const positionId = _body.positionId;
        const currentTime = Math.floor(Date.now() / 1000);
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                let promise = [];

                candidateList.forEach(element => {
                    const linkCandidateQuery = {
                        name: 'link-candidate-with-position',
                        text: candidateQuery.linkCandidateWithPosition,
                        values: [positionId, element.candidateId, _body.employeeId, currentTime],
                    }
                    promise.push(client.query(linkCandidateQuery));
                });

                candidateList.forEach(element => {
                    const updateSellerRate = {
                        name: 'update-seller-rate',
                        text: candidateQuery.updateSellerRate,
                        values: [element.candidateId, element.sellerId, _body.employeeId, currentTime],
                    }
                    promise.push(client.query(updateSellerRate));
                });


                await Promise.all(promise);
                await client.query('COMMIT')
                resolve({ code: 200, message: "Candidate added to position successfully", data: {} });
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