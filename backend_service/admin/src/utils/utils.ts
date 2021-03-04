export const adminPagination = (body) => {
    let pagination = '';
    // Pagination
    if (body.pageSize && body.pageNumber) {
        pagination= `   limit ${body.pageSize} offset ((${body.pageNumber}-1)*${body.pageSize}) `
    }
    return pagination;
}