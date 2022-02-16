import adminQuery from '..//admins/query/admin.query';

export const adminPagination = (body) => {
  let pagination = '';
  // Pagination
  if (body.pageSize && body.pageNumber) {
    pagination = `   limit ${body.pageSize} offset ((${body.pageNumber}-1)*${body.pageSize}) `;
  }
  return pagination;
};

export const usersFilter = (filter, filterQuery) => {
  if (filter) {
    let approveStatus = filter.approveStatus;
    let assesedBy=filter.assesedBy
    let fromDate=filter.fromDate
    let toDate=filter.toDate
    let companyType=filter.companyType
      if (notNull(approveStatus)) {
        if (approveStatus == 'active') {
          filterQuery = filterQuery + ' and  "adminApproveStatus"=1';
        } else if (approveStatus == 'closed') {
          filterQuery = filterQuery + ' and "adminApproveStatus"=0';
        }
      }
      if (notNull(assesedBy)) {
        
          filterQuery = filterQuery + ` and "assesedBy"='${assesedBy}'`;
      }
      if ((notNull(fromDate) && fromDate>0) && (notNull(toDate) && toDate>0)) {
        
        filterQuery = filterQuery + ` and  ("createdDate" between ${fromDate} and ${toDate}) `;
      }
      if (notNull(companyType)) {
        if (companyType == 'Hirer') {
          filterQuery = filterQuery + ' and "accountType"=1';
        } else if (companyType == 'Provider') {
          filterQuery = filterQuery + ' and "accountType"=2';
        }
        else if (companyType == 'Both') {
          filterQuery = filterQuery + ' and "companyType"=4';
        }
    }
  }
  return { filterQuery };
};


export const allUsersFilter = (filter, filterQuery) => {
  if (filter) {
    let approveStatus = filter.approveStatus;
    let assesedBy=filter.assesedBy
    let fromDate=filter.fromDate
    let toDate=filter.toDate
    let companyType=filter.companyType
      if (notNull(approveStatus)) {
        if (approveStatus == 'active') {
          filterQuery = filterQuery + ' and  e.admin_approve_status=1';
        } else if (approveStatus == 'closed') {
          filterQuery = filterQuery + ' and e.admin_approve_status=0';
        }
      }
      if ((notNull(fromDate) && fromDate>0) && (notNull(toDate) && toDate>0)) {
        
        filterQuery = filterQuery + ` and e.created_on between ${fromDate} and ${toDate} `;
      }
      if (notNull(companyType)) {
        if (companyType == 'Hirer') {
          filterQuery = filterQuery + ' and  e.account_type=1';
        } else if (companyType == 'Provider') {
          filterQuery = filterQuery + ' and e.account_type=2';
        }
    }
  }
  return { filterQuery };
};
export const userSort = (body) => {
  let sort = '';
  // Sorting keys with values
  const orderBy = {
    updatedOn: 'src."updatedDate"',
    createdOn: 'src."createdDate"',
    firstName: 'src."firstName"',
    lastName: 'src."lastName"',
    email: 'src.email',
    accountType: 'src."accountType"',
    phoneNumber: 'src."phoneNumber"',
    companyName: 'src."companyName"',
    assesedBy: 'src."assesedBy"',
    type: 'src."accountType"',
  };

  if (body.sortBy && body.sortType && Object.keys(orderBy).includes(body.sortBy)) {
    sort = ` ORDER BY ${orderBy[body.sortBy]} ${body.sortType}  nulls last `;
  }
  return sort;
};
export const usersPagination = (body) => {
  let pagination = '';
  // Pagination
  if (body.pageSize && body.pageNumber) {
    pagination = `  limit ${body.pageSize} offset ((${body.pageNumber}-1)*${body.pageSize}) `;
  }
  return pagination;
};

export const notNull = (val) => {
  return [undefined, null, ''].includes(val) ? false : true;
};
