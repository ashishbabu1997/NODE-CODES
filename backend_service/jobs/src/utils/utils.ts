
export const objectToArray = (objectArray,keyName) => {
    let reqArray = [];
    objectArray.forEach(element => {
        reqArray.push(element[keyName])
    });
    return reqArray;
}

export const jobsPagination = (body) => {
    let pagination = '';
    // Pagination
    if (body.pageSize && body.pageNumber) {
        pagination= `  limit ${body.pageSize} offset ((${body.pageNumber}-1)*${body.pageSize}) `
    }
    return pagination;
}
export const delay=(ms: number) =>{
    return new Promise( resolve => setTimeout(resolve, ms) );
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
        positionStatus = filter.positionStatus,
        activeStatus=filter.activeStatus,
        typeOfJob=filter.typeOfJob
        ; 
        
        if(![null,undefined,''].includes(startDate) && ![null,undefined,''].includes(endDate))
        {   
            filterQuery=filterQuery+' AND p.created_on BETWEEN $startdate  AND $enddate '
            queryValues = Object.assign({startdate:startDate,enddate:endDate},queryValues)
        }
        if(![null,undefined,''].includes(typeOfJob))
        {   
            filterQuery=filterQuery+' AND p.type_of_job=$typeofjob '
            queryValues = Object.assign({typeofjob:typeOfJob},queryValues)
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
            filterQuery += ' and (ARRAY (select case when chsv."positionStatusName" is null then \'Submitted to Hirer\' else chsv."positionStatusName" end from candidate_hiring_steps_view chsv where chsv."positionId" = p.position_id)) @> $status '
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
        if(![null,undefined,''].includes(activeStatus) && activeStatus=='active')
        {
            filterQuery=filterQuery+' AND p.job_status=$active'
            queryValues = Object.assign({active:6},queryValues)
        }
        if(![null,undefined,''].includes(activeStatus) && activeStatus=='closed')
        {
            filterQuery=filterQuery+' AND p.job_status=$closed'
            queryValues = Object.assign({closed:8},queryValues)
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
        "candidateCount": '"totalResourceCount"',
        "resourceCount": 'p.developer_count',
        "companyName": 'c.company_name',
        "updatedOn":'p.updated_on',
        "jobCategory":'jc.job_category_name'
        // p.developer_count
    }
    
    if (body.sortBy && body.sortType && Object.keys(orderBy).includes(body.sortBy)) {
        sort = body.sortBy=='updatedOn'? ` ORDER BY p.job_status asc , p.updated_on desc `:` ORDER BY ${orderBy[body.sortBy]} ${body.sortType} `;                
    }
    return sort;
}

export const hirerPositionSort = (body) => {
    let sort = '';
    // Sorting keys with values
    const orderBy = {
        "position": 'p.position_id',
        "positionName": 'p.position_name',
        "createdOn": 'p.created_on',
        "candidateCount": '"totalResourceCount"',
        "resourceCount": '"resourceCount"',
        "companyName": 'c.company_name',
        "updatedOn":'p.updated_on',
        "jobCategory":'jc.job_category_name'
        // p.developer_count
    }
    
    if (body.sortBy && body.sortType && Object.keys(orderBy).includes(body.sortBy)) {
        sort = ` ORDER BY ${orderBy[body.sortBy]} ${body.sortType} `;                
    }
    return sort;
}
export const positionTab = (body) =>{
    var vettedQuery = '';
    
    switch (body.tabValue) {
        
        case '0':
        vettedQuery='  and (p.job_status = 6 or p.job_status=8)   '
        break;
        case '1':
        vettedQuery=' and p.job_status = 5 and p.created_by = $employeeid'
        break;
        default:
        break;
    }
    
    return vettedQuery;
}

export const jobsTab = (body) =>{
    var vettedQuery = '';
    switch (body.tabValue) {
        case '0':
        vettedQuery='  and (select count(*) FROM candidate_hiring_steps_view chsv join candidate cn on cn.candidate_id = chsv."candidateId" WHERE chsv."positionId" = p.position_id and cn.company_id =$companyid and chsv."cpStatus" = true and p.status = true)=0'
        break;
        case '1':
        vettedQuery='  and (select count(*) FROM candidate_hiring_steps_view chsv join candidate cn on cn.candidate_id = chsv."candidateId" WHERE chsv."positionId" = p.position_id and cn.company_id =$companyid and chsv."cpStatus" = true and p.status = true)!=0'
        break;
        default:
        break;
    }
    
    return vettedQuery;
}
export const positionPagination = (body) => {
    let pagination = '';
    // Pagination
    if (body.pageSize && body.pageNumber) {
        pagination= `  limit ${body.pageSize} offset ((${body.pageNumber}-1)*${body.pageSize}) `
    }
    return pagination;
}

export const activePositionSort = (body) => {
    let sort = '';
    // Sorting keys with values
    const orderBy = {
        "position": 'position_name',
        "positions": 'developer_count',
        "company": 'company_name',
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
        "name": 'chsv."candidateFirstName"',
        "position": 'chsv."positionName"',
        "allocateTo": 'e.firstname',
    }
    
    if (body.sortBy && body.sortType && Object.keys(orderBy).includes(body.sortBy)) {
        if(body.sortBy=="name")
        {
            sort= ` order by name ${body.sortType} `;
        }
        else if(body.sortBy=="allocateTo")
        {
           
            sort= ` order by assignedTo ${body.sortType} `;
        }
        else
        {
            sort = ` ORDER BY ${orderBy[body.sortBy]} ${body.sortType} `;  
        }
                  
    }
    return sort;
}