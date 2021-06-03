import designationQuery from './query/designationsQuery.ts';
import database from '../common/database/database';



export const listDesignations = () => {    
    return new Promise((resolve, reject) => {
     const fetchDesignations ={
       
            name: 'fetch-designation-list',
            text: designationQuery.fetchDesignations,
    
    }
    
    database().query(fetchDesignations).then((results,error) => {
        if (error) {
            resolve ({ code: 400, message: "Failed. Please try again.", data: {} });
        }
        resolve({ code: 200, message: "Designations listed succesfully", data:  results.rows  });   
    })
})

}

