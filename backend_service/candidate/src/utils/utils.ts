

export const objectToArray = (objectArray,keyName) => {
    let reqArray = [];
    objectArray.forEach(element => {
        reqArray.push(element[keyName])
    });
    return reqArray;
}

export  const resourceFilter = (filter,filterQuery,queryValues) =>{
    if(filter)
    {               
        let resourcesType = filter.resourcesType,
        skills = filter.skills,
        experience = filter.experience,
        locations = filter.locations,
        fromDate = filter.fromDate,
        toDate = filter.toDate,
        availability = filter.availability,
        allocatedTo = filter.allocatedTo,
        positionStatus = filter.positionStatus,
        candStatus = filter.candidateStatus,
        minCost = filter.mincost,
        maxCost = filter.maxcost,
        billingType = filter.billingType,
        currencyType = filter.currencyType
        ;
        
        if(![undefined,null,''].includes(resourcesType) && Array.isArray(resourcesType) && resourcesType.length)
        {  
            if(resourcesType.includes('Vetted Resources'))    
            filterQuery=filterQuery+' AND chsv."candidateVetted" = 6'
            
            if(resourcesType.includes('Non-Vetted Resources'))    
            filterQuery=filterQuery+' AND chsv."candidateVetted" != 6'
        }
        if(![undefined,null,''].includes(skills) && Array.isArray(skills) && skills.length)
        {
            filterQuery=filterQuery+' AND skills @> $skill::varchar[]'                
            queryValues =  Object.assign({skill:objectToArray(skills,'skillName')},queryValues)
        }
        
        if(minCost >= 0 && maxCost >= 0 && ![undefined,null,''].includes(currencyType) && ![undefined,null,''].includes(billingType))
        {
            filterQuery=filterQuery+' AND chsv."currencyTypeId" = $currencytype AND chsv."billingTypeId" = $billingtype AND chsv."rate" BETWEEN $cost_min and $cost_max '
            queryValues =  Object.assign({billingtype:billingType,currencytype:currencyType,cost_min:minCost,cost_max:maxCost},queryValues) 
        }

        if(![undefined,null,''].includes(experience) && Object.keys(experience).length != 0)
        {
            if(experience.min >= 0 && experience.max >= 0)
            {
                filterQuery=filterQuery+' AND chsv."workExperience" BETWEEN $experience_min and $experience_max '
                queryValues =  Object.assign({experience_min:experience.min,experience_max:experience.max},queryValues) 
            }
        }
        if(![undefined,null,''].includes(locations) && Array.isArray(locations) && locations.length)
        {
            filterQuery=filterQuery+' AND chsv."residence" = any($locations) '
            queryValues =  Object.assign({locations:locations},queryValues) 
        }
        if(![undefined,null,''].includes(fromDate) && fromDate > 0 && ![undefined,null,''].includes(toDate) && toDate > 0)
        {
            filterQuery=filterQuery+' AND chsv."createdOn" BETWEEN $fromdate and $todate '
            queryValues =  Object.assign({fromdate:fromDate,todate:toDate,},queryValues)
        }
        
        if(![undefined,null,''].includes(availability) && availability > 0)
        {
            filterQuery=filterQuery+' AND chsv."availabilityType" = $availability '
            queryValues =  Object.assign({availability:availability},queryValues)
        }
        if(![undefined,null,''].includes(allocatedTo) && allocatedTo > 0)
        {
            filterQuery=filterQuery+' AND chsv."allocatedTo" = $allocatedto '
            queryValues =  Object.assign({allocatedto:allocatedTo},queryValues)
        }
        if(![undefined,null,''].includes(positionStatus) && Array.isArray(positionStatus) && positionStatus.length)
        {
            filterQuery=filterQuery+' AND chsv."positionStatusName" ilike any (select concat(array_element,\'%\') from unnest($positionstatus::text[]) array_element(array_element)) '
            queryValues =  Object.assign({positionstatus: positionStatus},queryValues) 
        }
        if(![undefined,null,''].includes(candStatus) && Array.isArray(candStatus) && candStatus.length)
        {            
            filterQuery=filterQuery+' AND chsv."stageStatusName" ilike any(select concat(array_element,\'%\') from unnest($candstatus::text[]) array_element(array_element)) '
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
        "updatedOn" : 'chsv."updatedOn"'
    }
    
    if (body.sortBy && body.sortType && Object.keys(orderBy).includes(body.sortBy)) {
        sort = ` ORDER BY ${orderBy[body.sortBy]} ${body.sortType}`;                
    }
    return sort;
}


export const resourceSearch = (body,queryValues) =>{
    let searchKey = '%%',searchQuery= '';
    
    if(![undefined,null,''].includes(body.searchKey))
    {            
        searchKey='%' + body.searchKey + '%';
        searchQuery = ' AND (chsv."candidateFirstName" ILIKE $searchkey OR chsv."candidateLastName" ILIKE $searchkey OR chsv."companyName" ILIKE $searchkey) '
        queryValues=Object.assign({searchkey:searchKey},queryValues)
    }
    
    return {searchQuery,queryValues};
}