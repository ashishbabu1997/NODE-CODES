/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import config from '../config/config';
import * as fs from 'fs';

export const objectToArray = (objectArray, keyName) => {
  const reqArray = [];
  objectArray.forEach((element) => {
    reqArray.push(element[keyName]);
  });
  return reqArray;
};

export const resourceFilter = (filter, filterQuery, queryValues) => {
  if (filter && ![undefined, null, ''].includes(filter) && Object.keys(filter).length) {
    const resourcesType = filter.resourcesType;
    const skills = filter.skills;
    const experience = filter.range;
    const locations = filter.locations;
    const fromDate = filter.fromDate;
    const toDate = filter.toDate;
    const availability = filter.availability;
    const allocatedTo = filter.allocatedTo;
    const positionStatus = filter.positionStatus;
    const candStatus = filter.candidateStatus;
    const minCost = filter.mincost;
    const maxCost = filter.maxcost;
    const billingTypeId = filter.billingTypeId;
    const currencyType = filter.currencyType;
    const otherSkills = filter.otherSkills;
    const createdUser = filter.createdUser;
    const jobCategoryName = filter.jobCategoryName
      ;

    if (![undefined, null, ''].includes(resourcesType) && Array.isArray(resourcesType) && resourcesType.length) {
      if (resourcesType.includes('Vetted Resources')) {
        filterQuery = filterQuery + ' AND chsv."candidateVetted" = 6 ';
      }

      if (resourcesType.includes('Non-Vetted Resources')) {
        filterQuery = filterQuery + ' AND chsv."candidateVetted" != 6 ';
      }
    }
    if (![undefined, null, ''].includes(skills) && Array.isArray(skills) && skills.length) {
      filterQuery = filterQuery + ' AND skills && $skill::varchar[] ';
      queryValues = Object.assign({skill: objectToArray(skills, 'skillName')}, queryValues);
    }
    if (![undefined, null, ''].includes(otherSkills) && Array.isArray(otherSkills) && otherSkills.length) {
      filterQuery = filterQuery + ' AND otherskills && $otherskill::varchar[] ';
      queryValues = Object.assign({otherskill: objectToArray(otherSkills, 'skillName')}, queryValues);
    }

    if (minCost >= 0 && maxCost >= 0 && ![undefined, null, ''].includes(currencyType) && ![undefined, null, ''].includes(billingTypeId)) {
      filterQuery = filterQuery + ' AND chsv."currencyTypeId" = $currencytype AND chsv."billingTypeId" = $billingtypeid AND chsv."rate" BETWEEN $cost_min and $cost_max ';
      queryValues = Object.assign({billingtypeid: billingTypeId, currencytype: currencyType, cost_min: minCost, cost_max: maxCost}, queryValues);
    }

    if (![undefined, null, ''].includes(experience) && Object.keys(experience).length != 0) {
      if (experience.min >= 0 && experience.max > 0) {
        filterQuery = filterQuery + ' and chsv."workExperience" between $experience_min and $experience_max ';
        queryValues = Object.assign({experience_min: experience.min, experience_max: experience.max}, queryValues);
      }
    }
    if (![undefined, null, ''].includes(locations) && Array.isArray(locations) && locations.length) {
      filterQuery = filterQuery + ' and chsv."residence" = any($locations) ';
      queryValues = Object.assign({locations: locations}, queryValues);
    }
    if (![undefined, null, ''].includes(fromDate) && fromDate > 0 && ![undefined, null, ''].includes(toDate) && toDate > 0) {
      filterQuery = filterQuery + ' and chsv."createdOn" between $fromdate and $todate ';
      queryValues = Object.assign({fromdate: fromDate, todate: toDate}, queryValues);
    }

    if (![undefined, null, ''].includes(availability)) {
      if (availability == -1) {
        filterQuery = filterQuery + ' and chsv."availability"=false ';
      } else if (availability == -2) {
        filterQuery = filterQuery + ' and chsv."availability"=true';
      } else {
        filterQuery = filterQuery + ' and chsv."readyToStart" = $availability and chsv."availability"=true ';
        queryValues = Object.assign({availability: availability}, queryValues);
      }
    }

    if (![undefined, null, ''].includes(allocatedTo)) {
      if (allocatedTo > 0) {
        filterQuery = filterQuery + ' and chsv."allocatedTo" = $allocatedto ';
        queryValues = Object.assign({allocatedto: allocatedTo}, queryValues);
      } else if (allocatedTo == -1) {
        filterQuery = filterQuery + ' and chsv."allocatedTo" is null ';
      }
    }
    if (![undefined, null, ''].includes(positionStatus) && Array.isArray(positionStatus) && positionStatus.length) {
      filterQuery = filterQuery + ' and (select case when chsv."positionStatusName" is null then \'Submitted to hirer\' else chsv."positionStatusName" end) ilike any (select concat(array_element,\'%\') from unnest($positionstatus::text[]) array_element(array_element)) and "positionId" is not null ';
      queryValues = Object.assign({positionstatus: positionStatus}, queryValues);
    }
    if (![undefined, null, ''].includes(candStatus) && Array.isArray(candStatus) && candStatus.length) {
      filterQuery = filterQuery + ' and chsv."stageStatusName" ilike any(select concat(array_element,\'%\') from unnest($candstatus::text[]) array_element(array_element)) ';
      queryValues = Object.assign({candstatus: candStatus}, queryValues);
    }
    if (![undefined, null, ''].includes(createdUser)) {
      filterQuery = filterQuery + '  and chsv."createdBy" in (select employee_id from employee where user_role_id=$createdUser and employee_id=chsv."createdBy")';
      queryValues = Object.assign({createdUser: createdUser}, queryValues);
    }
    if (![undefined, null, ''].includes(jobCategoryName)) {
      filterQuery = filterQuery + ' and chsv."jobCategoryId" in (select job_category_id from job_category where job_category_name ilike $jobCategoryName)';
      queryValues = Object.assign({jobCategoryName: jobCategoryName}, queryValues);
    }
  }

  return {filterQuery, queryValues};
};

export const resourceSort = (body) => {
  let sort = '';
  // Sorting keys with values
  const orderBy = {
    'candidateId': 'chsv."candidateId"',
    'candidateFirstName': 'chsv."candidateFirstName"',
    'candidatelastName': 'chsv."candidateLastName"',
    'companyName': 'chsv."companyName"',
    'updatedOn': 'chsv."updatedOn"',
    'availability': 'chsv."availability"',
    'createdOn': 'chsv."createdOn"',
    'experience': 'chsv."workExperience"',
    'email': 'chsv."email"',

  };
  if (body.sortBy && body.sortType && Object.keys(orderBy).includes(body.sortBy)) {
    if (body.sortBy == 'availability') {
      sort = ` order by availability desc,"readyToStart" ${body.sortType} `;
    } else if (body.sortBy == 'updatedOn') {
      sort = ` ORDER BY ${orderBy[body.sortBy]} ${body.sortType},chsv."candidateVetted" desc `;
    } else {
      sort = ` ORDER BY ${orderBy[body.sortBy]} ${body.sortType}`;
    }
  }
  return sort;
};

export const resourcePagination = (body) => {
  let pagination = '';
  // Pagination
  if (body.pageSize && body.pageNumber) {
    pagination = `  limit ${body.pageSize} offset ((${body.pageNumber}-1)*${body.pageSize}) `;
  }
  return pagination;
};


export const resourceSearch = (body, queryValues) => {
  let searchKey = '%%'; let searchQuery = '';

  if (![undefined, null, ''].includes(body.searchKey)) {
    searchKey = '%' + body.searchKey + '%';
    searchQuery = ' AND (chsv."candidateFirstName" ILIKE $searchkey OR chsv."candidateLastName" ILIKE $searchkey OR chsv."candidatePositionName" ILIKE $searchkey OR chsv."companyName" ILIKE $searchkey OR  chsv."email" ILIKE $searchkey  OR chsv."phoneNumber" ILIKE $searchkey) ';
    queryValues = Object.assign({searchkey: searchKey}, queryValues);
  }

  return {searchQuery, queryValues};
};


export const resourceTab = (body) => {
  let query = '';

  switch (body.tabValue) {
    case 'allResources':
      query = '  where chsv."candidateStatus"=3 and chsv."blacklisted"=false ';
      break;
      case 'rejected':
        query = '  where chsv."candidateStatus"=3 and chsv."blacklisted"=false  and chsv."candidateVetted"=0';
        break;
    case 'nonVetted':
      query = '  where chsv."candidateStatus"=3 and chsv."blacklisted"=false and (chsv."candidateVetted" not in (0,6) or chsv."candidateVetted" is null)';
      break;
    case 'vetted':
      query = '  where chsv."candidateStatus"=3 and chsv."candidateVetted"=6 and chsv."blacklisted"=false and chsv."ellowStatusId" in (12,14) ';
      break;
    case 'certified':
      query = '  where chsv."candidateStatus"=3 and chsv."candidateVetted"=6 and chsv."ellowStatusId"=15 and chsv."blacklisted"=false ';
      break;
    case 'blacklisted':
      query = '  where chsv."blacklisted"=true';
      break;
    case 'draftFreelancer':
      query = `  where chsv."companyId"= (select company_id from company where company_type=2) and  ( chsv."candidateStatus" in (4,9) or chsv."candidateStatus" is null )   and chsv."blacklisted"=false  and chsv."createdBy" not in (select employee_id from employee where user_role_id=1)`;
      break;
    case 'myDraft':
      query = ` where (chsv."candidateStatus" = 4 and chsv."createdBy" = ${body.employeeId}) and chsv."blacklisted"=false`;
      break;
    case 'provider':
      query = `  where chsv."companyId" not in (select company_id from company where company_type=2) and chsv."candidateStatus"=9`;
      break;
      case 'incontract':
        query = '  where chsv."candidateStatus"=3 and chsv."pStatus"=true and chsv."blacklisted"=false and chsv."makeOffer"=0 ';
        break;
    default:
      break;
  }

  return query;
};

export const resourceHirerTab = (body) => {
  let query = '';
  switch (body.tabValue) {
    case 'allResources':
      query = ' and chsv."candidateStatus"=3 ';
      break;
    case 'myDraft':
      query = ' and chsv."candidateStatus"=4 ';
      break;
    default:
      break;
  }
  return query;
};
export const resourceProviderTab = (body) => {
  let query = '';
  switch (body.tabValue) {
    case 'allResources':
      query = '  and (chsv."candidateStatus"=3 or chsv."candidateStatus"= 9)  and chsv."blacklisted"=false ';
      break;
    case 'nonVetted':
      query = '  and chsv."candidateStatus"=3 and chsv."blacklisted"=false and (chsv."candidateVetted"!=6 or chsv."candidateVetted" is null)';
      break;
    case 'vetted':
      query = '  and chsv."candidateStatus"=3 and chsv."candidateVetted"=6 and chsv."blacklisted"=false and chsv."stageStatusName" ilike \'Verified\' ';
      break;
    case 'certified':
      query = '  where chsv."candidateStatus"=3 and chsv."candidateVetted"=6 and chsv."stageStatusName" ilike \'ellow Certified And Verified\' and chsv."blacklisted"=false';
      break;
    case 'myDraft':
      query = ' and  chsv."candidateStatus"= 4  and chsv."blacklisted"=false ';
      break;
    default:
      break;
  }
  return query;
};

export const emptyStringCheck = (_body) => {
  console.log('BODY', _body);
  _body = _body === '' || undefined ? null : _body;
  return _body;
};
export const jsonStringParse = (_body) => {
  let parsedString = '';
  try {
    parsedString = JSON.parse(_body);
  } catch (e) {
    console.log('Unable to parse : ', _body);
    return parsedString;
  }
  return parsedString;
};
export const resourceRoleBased = (reqBody, queryValues) => {
  let roleBasedQuery = '';
  if (reqBody.userRoleId != '1') {
    roleBasedQuery = ' and  chsv."companyId" = $companyid ';
    queryValues = Object.assign({companyid: reqBody.companyId}, queryValues);
  }

  return {roleBasedQuery, queryValues};
};
export const listFreResourceRoleBased = (reqBody, queryValues) => {
  let roleBasedQuery = '';
  if (reqBody.userRoleId != 1) {
    roleBasedQuery = ' where  chsv."companyId" = $companyid  ';
    queryValues = Object.assign({companyid: reqBody.companyId}, queryValues);
  } else {
    roleBasedQuery = ' where (chsv."candidateStatus" = 3 or (chsv."candidateStatus" = 4 and chsv."createdBy" = $employeeid)) ';
    queryValues = Object.assign({employeeid: reqBody.employeeId}, queryValues);
  }

  return {roleBasedQuery, queryValues};
};

export const stringEquals = (a, b) => {
  return typeof a === 'string' && typeof b === 'string' ?
    a.localeCompare(b, undefined, {sensitivity: 'accent'}) === 0 :
    a === b;
};

export const notNull = (val) => {
  return [undefined, null, '', ' '].includes(val) ? false : true;
};

export const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1).toLocaleLowerCase();
};


export const constValues = (type, value) => {
  const crr = {1: '₹', 2: '$'}; const bill = {0: 'hour', 1: 'day', 2: 'month'};
  const readytostart = {1: 'Immediate', 2: 'In one week', 3: 'In two weeks', 4: 'In one month', 5: 'More than one month'};

  switch (type) {
    case 'currencyType':
      return crr[value];
    case 'billType':
      return bill[value];
    case 'readyToStart':
      return readytostart[value];
    default:
      break;
  }
};

export const shortNameForPdf = (name) => {
  const firstName = notNull(name.split(' ')[0][0]) ? name.split(' ')[0][0] : '';
  const lastName = notNull(name.split(' ')[1]) ? name.split(' ')[1] : '';

  return firstName + '.' + lastName + '.pdf';
};


export const reccuiterMailCheck = (email) => {
  const data = notNull(config.mailAuth[email]) ? config.mailAuth[email] : config.mailAuth['noreplymail'];
  return {
    user: data.email,
    pass: data.appPass,
    recipient: data.name,
  };
};

export const reccuiterSignatureCheck = (email) => {
  const data = notNull(config.mailAuth[email]) ? config.mailAuth[email] : config.mailAuth['noreplymail'];
  return {signature: data.signature};
};


export const base64Encode = (file) => {
  return 'data:image/gif;base64,' + fs.readFileSync(file, 'base64');
};

export const secondsToHms = (d) => {
  const da = Math.abs(Number(d));
  const h = Math.floor(da / 3600);
  const m = Math.floor(da % 3600 / 60);
  const sign = d > 0 ? '+' : '-';
  return `GMT${sign}${h}:${m}`;
};

export const extractGmt = (data) => {
  try {
    if (notNull(data)) {
      const jsonData = JSON.parse(data);
      return secondsToHms(parseInt(jsonData.rawOffset) + parseInt(jsonData.dstOffset));
    } else {
      return '';
    }
  } catch (error) {
    console.log('error while extracting GMT : ', error);
    return '';
  }
};
