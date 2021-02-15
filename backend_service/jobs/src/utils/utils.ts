
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
        let startDate = filter.fromDate,
        endDate = filter.toDate,
        company = filter.company,
        position = filter.position,
        allocatedTo = filter.allocatedTo,
        jobCategory = filter.jobCategory,
        duration = filter.range,
        coreSkills = filter.skills,
        otherSkills = filter.otherSkills,
        positionStatus = filter.positionStatus
        ; 
        
        if(![null,undefined,''].includes(startDate) && ![null,undefined,''].includes(endDate))
        {   
            filterQuery=filterQuery+' AND p.created_on BETWEEN $startdate  AND $enddate '
            queryValues = Object.assign({startdate:startDate,enddate:endDate},queryValues)
        }
        if(![undefined,null,''].includes(duration) && Object.keys(duration).length != 0)
        {
            if(duration.min >= 0 && duration.max > 0)
            {
                filterQuery=filterQuery+' AND p.contract_duration BETWEEN $minduration AND $maxduration '
                queryValues = Object.assign({minduration:duration.min,maxduration:duration.max},queryValues) 
            }
        }
        if(Array.isArray(company) && company.length)
        {   
            filterQuery=filterQuery+' AND c.company_name = any($company::varchar[]) '
            queryValues = Object.assign({company:company},queryValues)
        }

        if(Array.isArray(position) && position.length)
        {   
            filterQuery=filterQuery+' AND p.position_name = any($position::varchar[]) '
            queryValues = Object.assign({position:position},queryValues)
        }

        if(![null,undefined,''].includes(allocatedTo) && Number.isInteger(allocatedTo))
        {
            if(allocatedTo > 0)
            {
                filterQuery=filterQuery+' AND p.allocated_to = $allocatedto '
                queryValues = Object.assign({allocatedto:allocatedTo},queryValues)
            }
            else if(allocatedTo == 0)
            {
                filterQuery=filterQuery+' AND p.allocated_to is null '
            }
        }
        if(![null,undefined,''].includes(jobCategory) && Number.isInteger(jobCategory))
        {
            filterQuery=filterQuery+' AND p.job_category_id = $jobcategory '
            queryValues = Object.assign({jobcategory:jobCategory},queryValues)
        }

        if(Array.isArray(positionStatus) && positionStatus.length)
        {
            filterQuery += ' and (ARRAY (select case when chsv."positionStatusName" is null then \'Submitted to hirer\' else chsv."positionStatusName" end from candidate_hiring_steps_view chsv where chsv."positionId" = p.position_id)) @> $status '
            queryValues = Object.assign({status:positionStatus},queryValues)
        }

        if(Array.isArray(coreSkills) && coreSkills.length)
        {
            filterQuery+=' and $skill::integer[] <@ (select ARRAY (select js.skill_id from job_skills js where p.position_id=js.position_id and js.status=true and js.top_rated_skill=true)) '
            queryValues =  Object.assign({skill:objectToArray(coreSkills,'skillId')},queryValues)
        }
        if(Array.isArray(otherSkills) && otherSkills.length)
        {
            filterQuery+=' and $otherskill::integer[] && (select ARRAY (select js.skill_id from job_skills js where p.position_id=js.position_id and js.status=true and js.top_rated_skill=false)) '
            queryValues =  Object.assign({otherskill:objectToArray(otherSkills,'skillId')},queryValues)
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
        sort = ` ORDER BY ${orderBy[body.sortBy]} ${body.sortType} `;                
    }
    return sort;
}


export const activePositionSort = (body) => {
    let sort = '';
    // Sorting keys with values
    const orderBy = {
        "positionName": 'position_name',
        "developerCount": 'developer_count',
        "companyName": 'company_name',
    }
    
    if (body.sortBy && body.sortType && Object.keys(orderBy).includes(body.sortBy)) {
        sort = ` ORDER BY ${orderBy[body.sortBy]} ${body.sortType} `;                
    }
    return sort;
}

export const upcomingInterviewSort = (body) => {
    let sort = '';
    // Sorting keys with values
    const orderBy = {
        "name": 'name',
        "positionName": 'position_name',
        "assignedTo": 'assignedTo',
    }
    
    if (body.sortBy && body.sortType && Object.keys(orderBy).includes(body.sortBy)) {
        sort = ` ORDER BY ${orderBy[body.sortBy]} ${body.sortType} `;                
    }
    return sort;
}