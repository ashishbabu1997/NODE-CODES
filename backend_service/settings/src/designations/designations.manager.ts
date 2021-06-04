import designationQuery from './query/designationsQuery.ts';
import database from '../common/database/database';

export const listDesignations = () => {    
    return new Promise((resolve, reject) => {
        var designations={}
     const fetchDesignations ={
       
            name: 'fetch-designation-list',
            text: designationQuery.fetchDesignations,
    
    }
    database().query(fetchDesignations).then((results,error) => {
        if (error) {
            reject ({ code: 400, message: "Failed. Please try again.", data: {} });
        }
   
                        resolve({ code: 200, message: "Designations listed succesfully", data: {designations:results.rows[0].designations}});   

    })
})

}

