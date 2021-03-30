

export const objectToArray = (objectArray,keyName) => {
    let reqArray = [];
    objectArray.forEach(element => {
        reqArray.push(element[keyName])
    });
    return reqArray;
}

export  const resourceFilter = (filter,filterQuery,queryValues) =>{
    if(filter && ![undefined,null,''].includes(filter) && Object.keys(filter).length)
    {               
        let resourcesType = filter.resourcesType,
        skills = filter.skills,
        experience = filter.range,
        locations = filter.locations,
        fromDate = filter.fromDate,
        toDate = filter.toDate,
        availability = filter.availability,
        allocatedTo = filter.allocatedTo,
        positionStatus = filter.positionStatus,
        candStatus = filter.candidateStatus,
        minCost = filter.mincost,
        maxCost = filter.maxcost,
        billingTypeId = filter.billingTypeId,
        currencyType = filter.currencyType,
        otherSkills = filter.otherSkills
        ;
        
        if(![undefined,null,''].includes(resourcesType) && Array.isArray(resourcesType) && resourcesType.length)
        {  
            if(resourcesType.includes('Vetted Resources'))    
            filterQuery=filterQuery+' AND chsv."candidateVetted" = 6 '
            
            if(resourcesType.includes('Non-Vetted Resources'))    
            filterQuery=filterQuery+' AND chsv."candidateVetted" != 6 '
        }
        if(![undefined,null,''].includes(skills) && Array.isArray(skills) && skills.length)
        {
            filterQuery=filterQuery+' AND skills @> $skill::varchar[] '                
            queryValues =  Object.assign({skill:objectToArray(skills,'skillName')},queryValues)
        }
        if(![undefined,null,''].includes(otherSkills) && Array.isArray(otherSkills) && otherSkills.length)
        {
            filterQuery=filterQuery+' AND otherskills && $otherskill::varchar[] '                
            queryValues =  Object.assign({otherskill:objectToArray(otherSkills,'skillName')},queryValues)
        }
        
        if(minCost >= 0 && maxCost >= 0 && ![undefined,null,''].includes(currencyType) && ![undefined,null,''].includes(billingTypeId))
        {
            filterQuery=filterQuery+' AND chsv."currencyTypeId" = $currencytype AND chsv."billingTypeId" = $billingtypeid AND chsv."rate" BETWEEN $cost_min and $cost_max '
            queryValues =  Object.assign({billingtypeid:billingTypeId,currencytype:currencyType,cost_min:minCost,cost_max:maxCost},queryValues) 
        }
        
        if(![undefined,null,''].includes(experience) && Object.keys(experience).length != 0)
        {
            if(experience.min >= 0 && experience.max > 0)
            {
                filterQuery=filterQuery+' and chsv."workExperience" between $experience_min and $experience_max '
                queryValues =  Object.assign({experience_min:experience.min,experience_max:experience.max},queryValues) 
            }
        }
        if(![undefined,null,''].includes(locations) && Array.isArray(locations) && locations.length)
        {
            filterQuery=filterQuery+' and chsv."residence" = any($locations) '
            queryValues =  Object.assign({locations:locations},queryValues) 
        }
        if(![undefined,null,''].includes(fromDate) && fromDate > 0 && ![undefined,null,''].includes(toDate) && toDate > 0)
        {
            filterQuery=filterQuery+' and chsv."createdOn" between $fromdate and $todate '
            queryValues =  Object.assign({fromdate:fromDate,todate:toDate,},queryValues)
        }
        
        if(![undefined,null,''].includes(availability))
        {
            if(availability == -1)
            {
                filterQuery=filterQuery+' and chsv."availability"=false '
            }
            else
            {
                filterQuery=filterQuery+' and chsv."readyToStart" = $availability and chsv."availability"=true '
                queryValues =  Object.assign({availability:availability},queryValues)
            }
        }
        
        if(![undefined,null,''].includes(allocatedTo))
        {            
            if(allocatedTo > 0)
            {
                filterQuery=filterQuery+' and chsv."allocatedTo" = $allocatedto '
                queryValues =  Object.assign({allocatedto:allocatedTo},queryValues)
            }
            else if(allocatedTo == -1){
                filterQuery=filterQuery+' and chsv."allocatedTo" is null '
            } 
        }
        if(![undefined,null,''].includes(positionStatus) && Array.isArray(positionStatus) && positionStatus.length)
        {
            filterQuery=filterQuery+' and (select case when chsv."positionStatusName" is null then \'Submitted to hirer\' else chsv."positionStatusName" end) ilike any (select concat(array_element,\'%\') from unnest($positionstatus::text[]) array_element(array_element)) and "positionId" is not null '
            queryValues =  Object.assign({positionstatus: positionStatus},queryValues) 
        }
        if(![undefined,null,''].includes(candStatus) && Array.isArray(candStatus) && candStatus.length)
        {            
            filterQuery=filterQuery+' and chsv."stageStatusName" ilike any(select concat(array_element,\'%\') from unnest($candstatus::text[]) array_element(array_element)) '
            queryValues =  Object.assign({candstatus: candStatus},queryValues) 
        }
    }
    
    return {filterQuery,queryValues};
} 

export const resourceSort = (body) => {
    let sort = '';
    // Sorting keys with values
    const orderBy = {
        "candidateId": 'chsv."candidateId"',
        "candidateFirstName": 'chsv."candidateFirstName"',
        "candidatelastName": 'chsv."candidateLastName"',
        "companyName": 'chsv."companyName"',
        "updatedOn" : 'chsv."updatedOn"',
        "availability":'chsv."availability"',
        "createdOn":'chsv."createdOn"',        
        "experience":'chsv."workExperience"',
        "email":'chsv."email"'

    }
    if (body.sortBy && body.sortType && Object.keys(orderBy).includes(body.sortBy)) {
        if(body.sortBy=="availability")
        {
            sort= ` order by availability desc,"readyToStart" ${body.sortType} `;
        }
        else
        {
            sort = ` ORDER BY ${orderBy[body.sortBy]} ${body.sortType}`;
        }
        
    }
    return sort;
}

export const resourcePagination = (body) => {
    let pagination = '';
    // Pagination
    if (body.pageSize && body.pageNumber) {
        pagination= `  limit ${body.pageSize} offset ((${body.pageNumber}-1)*${body.pageSize}) `
    }
    return pagination;
}


export const resourceSearch = (body,queryValues) =>{
    let searchKey = '%%',searchQuery= '';
    
    if(![undefined,null,''].includes(body.searchKey))
    {            
        searchKey='%' + body.searchKey + '%';        
        searchQuery = ' AND (chsv."candidateFirstName" ILIKE $searchkey OR chsv."candidateLastName" ILIKE $searchkey OR chsv."candidatePositionName" ILIKE $searchkey OR chsv."companyName" ILIKE $searchkey) '
        queryValues=Object.assign({searchkey:searchKey},queryValues)
    }
    
    return {searchQuery,queryValues};
}

export const resourceTab = (body) =>{
    var vettedQuery = '';
    
    switch (body.tabValue) {
        
        case '0':
        vettedQuery='  and chsv."candidateStatus"=3 '
        break;
        case '1':
        vettedQuery='  and chsv."candidateStatus"=3 and chsv."candidateVetted"=6'
        break;
        case '2':
        vettedQuery='  and chsv."candidateStatus"=3 and (chsv."candidateVetted"!=6 or chsv."candidateVetted" is null)'
        break;
        case '3':
        vettedQuery='  and chsv."candidateStatus"=4'
        break; 
        
        default:
        break;
    }
    
    return vettedQuery;
}

export const resourceHirerTab = (body) =>{
    let vettedQuery = '';
    switch (body.tabValue) {
        case '1':
        vettedQuery=' and chsv."candidateStatus"=6 '
        break;
        case '2':
        vettedQuery=' and chsv."candidateStatus"!=6 '
        break;
        default:
        break;
    }
    
    return vettedQuery;
}

export const resourceRoleBased = (reqBody,queryValues) =>{
    let roleBasedQuery = '';
    if (reqBody.userRoleId != 1) {
        roleBasedQuery = ' and  chsv."companyId" = $companyid '
        queryValues=Object.assign({companyid:reqBody.companyId},queryValues)
    }
    else {
        roleBasedQuery =  ' and (chsv."candidateStatus" = 3 or (chsv."candidateStatus" = 4 and chsv."createdBy" = $employeeid)) ' 
        queryValues=Object.assign({employeeid:reqBody.employeeId},queryValues)
    }     
    
    return {roleBasedQuery,queryValues};
}
export const listFreResourceRoleBased = (reqBody,queryValues) =>{
    let roleBasedQuery = '';
    if (reqBody.userRoleId != 1) {
        roleBasedQuery = ' where  chsv."companyId" = $companyid  '
        queryValues=Object.assign({companyid:reqBody.companyId},queryValues)
    }
    else {
        roleBasedQuery =  ' where (chsv."candidateStatus" = 3 or (chsv."candidateStatus" = 4 and chsv."createdBy" = $employeeid)) ' 
        queryValues=Object.assign({employeeid:reqBody.employeeId},queryValues)
    }     
    
    return {roleBasedQuery,queryValues};
}