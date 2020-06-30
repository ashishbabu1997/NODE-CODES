import Query from './query/query';
import database from '../common/database/database';
 export const addDetails = (email,otp) => {
     return new Promise((resolve, reject) => {
         const query = {
             name: 'add-email-otp',
             text: Query.createUser,
             values: email,otp,
         }
         database().query(query, (error, results) => {
-            console.log(results, error)
             if (error) {
                 reject({ code: 400, message: "Failed. Please try again.", data: {} });
                 return;
                }
                database().query(query, (error, results) => {
       -            console.log(results, error)
                    if (error) {
                        reject({ code: 400, message: "Failed. Please try again.", data: {} });
                        return;
            })
        }
    

