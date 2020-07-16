import hiringStepsQuery from './query/hiringSteps.query';
import database from '../common/database/database';

export const getCompanyHiringSteps = (_body) => {
    return new Promise((resolve, reject) => {
        const query = {
            name: 'fetch-company-hiring-steps',
            text: hiringStepsQuery.getCompanyHiringSteps,
            values: [parseInt(_body.companyId)],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            console.log(results)
            const hiringSteps = results.rows;
            let groupedHiringStages = []
            hiringSteps.forEach(step => {
                let index = groupedHiringStages.findIndex(element => element.hiringStepId == step.hiring_step_id);
                if (index == -1) {
                    groupedHiringStages.push({
                        hiringStepId: step.hiring_step_id,
                        hiringStepName: step.hiring_step_name,
                        description: step.description,
                        hiringStages: step.hiring_stage_id != null ? [{
                            hiringStageId: step.hiring_stage_id,
                            hiringStageName: step.hiring_stage_name,
                            hiringStageDescription: step.hiring_stage_description,
                            hiringStageOrder: step.hiring_stage_order,
                        }] : []
                    })
                } else {
                    groupedHiringStages[index].hiringStages.push({
                        hiringStageId: step.hiring_stage_id,
                        hiringStageName: step.hiring_stage_name,
                        hiringStageDescription: step.hiring_stage_description,
                        hiringStageOrder: step.hiring_stage_order,
                    })
                }
            })
            resolve({ code: 200, message: "Hiring steps listed successfully", data: { groupedHiringStages } });
        })
    });
}

export const createCompanyHiringSteps = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);

        database().connect((err, client, done) => {
            const shouldAbort = err => {
                if (err) {
                    console.error('Error in transaction', err.stack)
                    client.query('ROLLBACK', err => {
                        if (err) {
                            console.error('Error rolling back client', err.stack)
                        }
                        done();
                        reject({ code: 400, message: "Failed. Please try again.", data: {} });

                    })
                }
                return !!err
            }
            client.query('BEGIN', err => {
                if (shouldAbort(err)) return
                const addHiringStepQuery = {
                    name: 'add-hiring-steps',
                    text: hiringStepsQuery.addHiringSteps,
                    values: [_body.companyId, _body.hiringStepName, _body.description, currentTime, currentTime],
                }
                client.query(addHiringStepQuery, (err, res) => {
                    if (shouldAbort(err)) return
                    const hiringStages = _body.hiringStages;
                    const hiringStepId = res.rows[0].hiring_step_id;
                    let hiringStageValues = ''
                    const length = hiringStages.length;
                    hiringStages.forEach((element, i) => {
                        const end = i != length - 1 ? "," : ";"
                        hiringStageValues = hiringStageValues + "('" + element.hiringStageName + "','" + element.hiringStageDescription + "'," + hiringStepId + "," + element.order + "," + currentTime + "," + currentTime + ")" + end
                    });
                    const query = hiringStepsQuery.addHiringStages + hiringStageValues
                    client.query(query, (err, res) => {
                        if (shouldAbort(err)) return
                        client.query('COMMIT', err => {
                            if (err) {
                                console.error('Error committing transaction', err.stack)
                            }
                            done()
                            resolve({ code: 200, message: "Hiring step created successfully", data: {} });
                        })
                    })
                })
            })
        })
    })
}


export const editCompanyHiringSteps = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);

        database().connect((err, client, done) => {
            const shouldAbort = err => {
                if (err) {
                    console.error('Error in transaction', err.stack)
                    client.query('ROLLBACK', err => {
                        if (err) {
                            console.error('Error rolling back client', err.stack)
                        }
                        done();
                        reject({ code: 400, message: "Failed. Please try again.", data: {} });

                    })
                }
                return !!err
            }
            client.query('BEGIN', err => {
                if (shouldAbort(err)) return
                const editHiringStepQuery = {
                    name: 'edit-hiring-steps',
                    text: hiringStepsQuery.editHiringSteps,
                    values: [_body.hiringStepId, _body.hiringStepName, _body.description, currentTime],
                }
                client.query(editHiringStepQuery, (err, res) => {
                    if (shouldAbort(err)) return
                    const hiringStages = _body.hiringStages;
                    let hiringStageValues = ''
                    const length = hiringStages.length;
                    hiringStages.forEach((element, i) => {
                        const end = i != length - 1 ? "," : ""
                        hiringStageValues = hiringStageValues + "(" + element.hiringStageId + ",'" + element.hiringStageName + "','" + element.hiringStageDescription + "'," + element.order + "," + currentTime + ")" + end
                    });
                    const query = hiringStepsQuery.editHiringStagesStart + hiringStageValues + hiringStepsQuery.editHiringStagesEnd
                    client.query(query, (err, res) => {
                        if (shouldAbort(err)) return
                        client.query('COMMIT', err => {
                            if (err) {
                                console.error('Error committing transaction', err.stack)
                            }
                            done()
                            resolve({ code: 200, message: "Hiring step updated successfully", data: {} });
                        })
                    })
                })
            })
        })
    })
}
