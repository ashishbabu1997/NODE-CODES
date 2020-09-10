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
            const candidate = results.rows;
            let hiringStages = [];
            let result = {
                candidateFirstName: candidate[0].candidatFirstName,
                companyLastName: candidate[0].companyLastName,
                positionName: candidate[0].positionName,
                description: candidate[0].description,
                coverNote: candidate[0].coverNote,
                resume: candidate[0].resume,
                rate: _body.userRoleId == 1 ? candidate[0].ellowRate : candidate[0].rate,
                billingType: candidate[0].billingTypeId,
                currencyTypeId: candidate[0].currencyTypeId,
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
            selectQuery = selectQuery + " " + "AND ((LOWER(ca.candidate_first_name) LIKE '%" + _body.filter.toLowerCase() + "%') " + "OR (LOWER(c.company_name) LIKE '%" + _body.filter.toLowerCase() + "%')) "
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
                // hiringStages.push({ positionHiringStageId: null, positionHiringStageName: 'applied candidates' })
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
        if (_body.decisionValue==1)
        {
            if(_body.userRoleId==1)
            {
                var adminApproveStatus=1
                var adminComments=_body.adminComment

            }
            const candidateApprovalQuery = {
                name: 'admin-panel',
                text:candidateQuery.candidateClearanceQuery,
                values:[_body.employeeId,true,1]
            }
            database().query(adminApprovalQuery, (error, results) => {
                if (error) {
                    reject({ code: 400, message: "Database Error", data: {} });
                    return;
                }
                // resolve({ code: 200, message: "Users listed successfully", data: { Users: results.rows } });
            })
            const password = passwordGenerator.generate({
                length: 10,
                numbers: true
            });
            var hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
            const subject = " ellow.ai LOGIN PASSWORD "
            const storePasswordQuery = {
                name: 'store-encrypted-password',
                text: admineQuery.storePassword,
                values: [hashedPassword,_body.email],
            }
            database().query(storePasswordQuery, (error, results) => {
                if (error) {
                    console.log(error)
                    reject({ code: 400, message: "Database Error", data: {} });
                    return;
                }
            })
            // var desc=_body.description
            // var description=desc.fontsize(3).bold()
            var textFormat = config.text.firstLine + config.nextLine + config.text.secondLine + config.nextLine+config.text.thirdLine + config.nextLine + config.text.password + password + config.nextLine + config.text.fourthLine + config.nextLine + config.text.fifthLine
            sendMail(_body.email, subject, textFormat, function (err, data) {
                if (err) {
                    console.log(err)
                    reject({ code: 400, message: "Database Error", data: {} });
                    return;
                }
                console.log('A password has been send to your email !!!');
                resolve({ code: 200, message: "User Approval Successfull", data: {} });
            });
        }
        else
        {
            const adminApprovalQuery = {
                name: 'admin-panel',
                text:admineQuery.clearanceQuery,
                values:[_body.employeeId,false,0]
            }
            database().query(adminApprovalQuery, (error, results) => {
                if (error) {
                    console.log(error)
                    reject({ code: 400, message: "Database Error", data: {} });
                    return;
                }
            })
            var desc=_body.description
            var description=desc.fontsize(3).bold()
            var subject="ellow.ai ACCOUNT REJECTION MAIL "
            var textFormat = config.rejectText.firstLine + config.nextLine + config.rejectText.secondLine + config.nextLine+description+config.nextLine+config.rejectText.thirdLine + config.nextLine + config.rejectText.fourthLine + config.nextLine + config.rejectText.fifthLine
            sendMail(_body.email, subject, textFormat, function (err, data) {
                if (err) {
                    console.log(err)
                    return;
                }
                console.log('An admin rejection message has been sent to your email!!!');
                resolve({ code: 200, message: "User Rejection Successfull", data: {} });

            });

        }       
})
}