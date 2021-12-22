
import * as queryService from '../queryService/queryService';
import database from '../common/database/database';
import {nanoid} from 'nanoid'
import * as emailService from '../emailService/candidatesEmail';

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>>> candidateReporterDetailRemainder
export const candidateReporterDetailRemainder = (_body) => {
    return new Promise((resolve, reject) => {
      (async () => {
        const client = await database();
        try {
          await client.query('BEGIN');
          const promise=[]
          var result = await client.query(queryService.getWeeklyContractCandidates(_body));
          result.rows.forEach(async (element) => {
            element.uniqueId = nanoid()
            await emailService.ellowCandidateReporterFetchMail(_body);
            promise.push(client.query(queryService.insertIntoCandidateFeedbackReport(element)));
          });
          await Promise.all(promise);
          resolve({ code: 200, message: 'Details listed successfully', data: result.rows[0] });
          
          await client.query('COMMIT');
        } catch (e) {
          console.log(e);
          await client.query('ROLLBACK');
          reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
        }
      })().catch((e) => {
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      });
    });
  };




  // >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>>> Reporter initial feedback reminder
export const reporterInitialFeedbackRemainder = (_body) => {
    return new Promise((resolve, reject) => {
      (async () => {
        const client = await database();
        try {
          await client.query('BEGIN');
          const promise=[]
          var result = await client.query(queryService.getMidContractCandidateList(_body));
          result.rows.forEach(async (element) => {
            element.uniqueId = nanoid()
            await emailService.reporterInitialFeedbackRemainderMail(_body);
            promise.push(client.query(queryService.insertIntoCandidateFeedbackReport(element)));
          });
          await Promise.all(promise);
          resolve({ code: 200, message: 'Details listed successfully', data: result.rows[0] });
          
          await client.query('COMMIT');
        } catch (e) {
          console.log(e);
          await client.query('ROLLBACK');
          reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
        }
      })().catch((e) => {
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      });
    });
  };




    // >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>>> Reporter final feedback reminder
export const reporterFinalFeedbackRemainder = (_body) => {
    return new Promise((resolve, reject) => {
      (async () => {
        const client = await database();
        try {
          await client.query('BEGIN');
          const promise=[]
          var result = await client.query(queryService.getFinalContractCandidatesList(_body));
          result.rows.forEach(async (element) => {
            element.uniqueId = nanoid()
            await emailService.reporterInitialFeedbackRemainderMail(_body);
            promise.push(client.query(queryService.insertIntoCandidateFeedbackReport(element)));
          });
          await Promise.all(promise);
          resolve({ code: 200, message: 'Details listed successfully', data: result.rows[0] });
          
          await client.query('COMMIT');
        } catch (e) {
          console.log(e);
          await client.query('ROLLBACK');
          reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
        }
      })().catch((e) => {
        reject(new Error({ code: 400, message: 'Failed. Please try again.', data: e.message }.toString()));
      });
    });
  };

  