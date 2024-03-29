import config from '../config/config';
import database from '../common/database/database';
import * as queryService from '../queryService/queryService';


export const employeeSort = (body) => {
    let sort = '';
    // Sorting keys with values
    const orderBy = {
        "firstName": 'first_name',
        "lastName": 'last_name',
        "roleId": 'role_id',
        "email": 'email',
        "createdOn": 'created_on',
        "primaryEmail":'primary_email'
    }


    if (body.sortBy && body.sortType && Object.keys(orderBy).includes(body.sortBy)) {
        sort = ` ORDER BY ${orderBy[body.sortBy]} ${body.sortType} `;
    }
    else
        sort = `order by primary_email desc,status desc`
    return sort;
}
export const domainExtractor=(email)=>{
    var domain = email. substring(email. lastIndexOf("@")+1);
    return domain
}
export const pagination = (body) => {
    let pagination = '';
    // Pagination
    if (body.pageSize && body.pageNumber) {
        pagination = `  limit ${body.pageSize} offset ((${body.pageNumber}-1)*${body.pageSize}) `
    }
    return pagination;
}







export const JsonStringParse = (_body) => {
    let parsedString = "";
    try {
        parsedString = JSON.parse(_body);
    } catch (e) {
        console.log("Unable to parse : ", _body);
        return parsedString;
    }
    return parsedString;
}

export const stringEquals = (a, b) => {
    return typeof a === 'string' && typeof b === 'string'
        ? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
        : a === b;
}

export const notNull = (val) => {
    return [undefined, null, ''].includes(val) ? false : true;
}

export const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1).toLocaleLowerCase()
}

export const objectToArray = (objectArray, keyName) => {
    let reqArray = [];
    objectArray.forEach(element => {
        reqArray.push(element[keyName])
    });
    return reqArray;
}


export const getCountryStateFromId = (stateId: any, countryId: any) => {

    const {states,countries} = config;

    const stateResult = states.filter(state => state.id == stateId);
    const stateName = stateResult[0].name
    const countryResult = countries.filter(country => country.id == countryId);
    const countryName = countryResult[0].name

    return { countryName, stateName };
}