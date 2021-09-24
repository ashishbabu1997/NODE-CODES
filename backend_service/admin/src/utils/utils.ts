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

    if (notNull(approveStatus)) {
      if (approveStatus == 'active') {
        filterQuery = filterQuery + ' and  "adminApproveStatus"=1';
      } else if (approveStatus == 'closed') {
        filterQuery = filterQuery + ' and "adminApproveStatus"=0';
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
