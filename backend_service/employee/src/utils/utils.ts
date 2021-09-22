import * as queryService from '../queryService/queryService'
export const domainExtractor=(email)=>{
    var domain = email. substring(email. lastIndexOf("@")+1);
    return domain
}

export const notNull = (val) => {
    return [undefined, null, ''].includes(val) ? false : true;
}


