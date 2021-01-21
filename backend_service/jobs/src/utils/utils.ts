import { stat } from "fs/promises";

export const objectToArray = (objectArray,keyName) => {
    let reqArray = [];
    objectArray.forEach(element => {
        reqArray.push(element[keyName])
    });
    return reqArray;
}

export  const positionFilter = (filter,filterQuery,queryValues) =>{
    if(filter)
    {               
        let startDate = filter.postedFrom,
        endDate = filter.postedTo,
        company = filter.company,
        position = filter.position,
        allocatedTo = filter.allocatedTo,
        jobCategory = filter.jobCategory,
        status = filter.status
        ;
        
        if(![null,undefined,''].includes(startDate) && ![null,undefined,''].includes(endDate))
        {   
            filterQuery=filterQuery+' AND p.created_on BETWEEN $startdate  AND $enddate'
            queryValues = Object.assign({startdate:startDate,enddate:endDate},queryValues)
        }
        if(Array.isArray(company) && company.length)
        {   
            filterQuery=filterQuery+' AND p.company_name IN $company::varchar[]'
            queryValues = Object.assign({company:company},queryValues)
        }

        if(Array.isArray(position) && position.length)
        {   
            filterQuery=filterQuery+' AND p.position_name IN $position::varchar[]'
            queryValues = Object.assign({position:position},queryValues)
        }

        if(![null,undefined,''].includes(allocatedTo) && Number.isInteger(allocatedTo))
        {
            if(allocatedTo > 0)
            {
                filterQuery=filterQuery+' AND p.allocated_to = $allocatedto'
                queryValues = Object.assign({allocatedto:allocatedTo},queryValues)
            }
            else if(allocatedTo == 0)
            {
                filterQuery=filterQuery+' AND p.allocated_to is null'
            }
        }
        if(![null,undefined,''].includes(jobCategory) && Number.isInteger(jobCategory))
        {
            filterQuery=filterQuery+' AND p.job_category_id = $jobcategory'
            queryValues = Object.assign({jobcategory:jobCategory},queryValues)
        }

        if(Array.isArray(status) && status.length)
        {
            filterQuery += 'and (ARRAY (select case when chsv."positionStatusName" is null then \'Submitted to hirer\' else chsv."positionStatusName" end from candidate_hiring_steps_view chsv where chsv."positionId" = p.position_id)) @> $status'
            queryValues = Object.assign({status:status},queryValues)
        }
        
    }
    return {filterQuery,queryValues};
} 

export const positionSort = (body) => {
    let sort = '';
    // Sorting keys with values
    const orderBy = {
        "position": 'p.position_id',
        "positionName": 'p.position_name',
        "createdOn": 'p.created_on',
        "candidateCount": '"candidateCount"',
        "resourceCount": 'p.developer_count',
        "companyName": 'c.company_name',
        "updatedOn":'p.updated_on'
    }
    
    if (body.sortBy && body.sortType && Object.keys(orderBy).includes(body.sortBy)) {
        sort = ` ORDER BY ${orderBy[body.sortBy]} ${body.sortType}`;                
    }
    return sort;
}