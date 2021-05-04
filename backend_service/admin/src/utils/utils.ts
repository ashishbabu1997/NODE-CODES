import adminQuery from '..//admins/query/admin.query';

export const adminPagination = (body) => {
    let pagination = '';
    // Pagination
    if (body.pageSize && body.pageNumber) {
        pagination= `   limit ${body.pageSize} offset ((${body.pageNumber}-1)*${body.pageSize}) `
    }
    return pagination;
}

export  const usersFilter = (filter,filterQuery,queryValues) =>{
    if(filter)
    {               
        let approveStatus=filter.approveStatus
        ; 
        
        if(![null,undefined,''].includes(approveStatus) && approveStatus=='active')
        {
            filterQuery=filterQuery+' and  e.admin_approve_status=$active'
            queryValues = Object.assign({active:1},queryValues)
        }  
        if(![null,undefined,''].includes(approveStatus) && approveStatus=='closed')
        {
            filterQuery=filterQuery+' and e.admin_approve_status=$closed'
            queryValues = Object.assign({closed:0},queryValues)
        }  
       
    }
    return {filterQuery,queryValues};
} 
export const userSort = (body) => {
    let sort = '';
    // Sorting keys with values
    const orderBy = {
        "updatedOn": 'e.updated_on',
        "firstName":'e.firstname',
        "lastName":'e.lastname',
        "email":'e.email',
        "accountType":'e.account_type',
        "phoneNumber":'e.telephone_number',
        "companyName":'c.company_name'

    }
    
    if (body.sortBy && body.sortType && Object.keys(orderBy).includes(body.sortBy)) {
        sort = ` ORDER BY ${orderBy[body.sortBy]} ${body.sortType}  nulls last `;
    }
    return sort;
}
export const usersPagination = (body) => {
    let pagination = '';
    // Pagination
    if (body.pageSize && body.pageNumber) {
        pagination= `  limit ${body.pageSize} offset ((${body.pageNumber}-1)*${body.pageSize}) `
    }
    return pagination;
}