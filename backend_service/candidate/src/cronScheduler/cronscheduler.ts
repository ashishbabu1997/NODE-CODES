
import * as queryService from '../queryService/queryService';
import database from '../common/database/database';
import {nanoid} from 'nanoid'
import * as emailService from '../emailService/candidatesEmail';

// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>>> candidateReporterDetailRemainder
export const candidateReporterDetailRemainder = () => {
    return new Promise((resolve, reject) => {
      (async () => {
        const client = await database();
        try {
          await client.query('BEGIN');
          const promise=[]
          var result = await client.query(queryService.getWeeklyContractCandidates());
           result.rows.forEach( async (element) => {
            element.uniqueId = nanoid()
            emailService.ellowCandidateReporterFetchMail(element);
            promise.push(client.query(queryService.insertIntoCandidateFeedbackReport(element)));
          });
          console.log(promise)
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
export const reporterInitialFeedbackRemainder = () => {
    return new Promise((resolve, reject) => {
      (async () => {
        const client = await database();
        try {
          await client.query('BEGIN');
          const promise=[]
          var result = await client.query(queryService.getMidContractCandidateList());
          result.rows.forEach(async (element) => {
            element.uniqueId = nanoid()
             emailService.reporterInitialFeedbackRemainderMail(element);
            promise.push(client.query(queryService.updateFeedbackRemainder(element)));
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
export const reporterFinalFeedbackRemainder = () => {
    return new Promise((resolve, reject) => {
      (async () => {
        const client = await database();
        try {
          await client.query('BEGIN');
          const promise=[]
          var result = await client.query(queryService.getFinalContractCandidatesList());
          result.rows.forEach(async (element) => {
            element.uniqueId = nanoid()
           emailService.reporterFinalFeedbackRemainderMail(element);
            promise.push(client.query(queryService.updateFinalFeedbackRemainder(element)));
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
// >>>>>>>>>>>>>> Close contract expired candidate's contract
export const closeContract = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database();
      try {
        await client.query('BEGIN');
        const promise=[]
        var result = await client.query(queryService.getContractExpiredCandidates());
        result.rows.forEach(async (element) => {
          console.log(element)
          promise.push(client.query(queryService.closeCandidateContract()));
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