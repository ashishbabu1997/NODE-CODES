import notificationsQuery from '../notifications/query/notifications.query';
import adminQuery from '../admins/query/admin.query';


export const  listquery = (_body) =>{
    return {
        name: 'list-compnies',
        text: _body.queryText,
        values: _body.queryValues

    }
}
export const  listQueryCount = (_body) =>{
    return {
        name: 'list-companies-count',
        text: _body.queryCountText,
        values: _body.queryValues

    }
}

export const  listNotifications = () =>{
    return {
        name: 'list-notifications',
        text: notificationsQuery.listNotifications
    }
}

export const  listHirerNotifications = (companyId) =>{
    return {
        name: 'list-hirer-notifications',
        text: notificationsQuery.listHirerNotifications,
        values : [companyId]
    }
}

export const  fetchCandidatePositionReports = (dateRange,groupBy) =>{
    return {
        name: 'get-candidate-position-reports',
        text: adminQuery.candidatePositionReports+dateRange+groupBy
    }
}

export const  fetchPositionReports = (dateRange,groupBy) =>{
    return {
        name: 'get-position-reports',
        text: adminQuery.positionReports+dateRange+groupBy
    }
}

export const  fetchCandidateReports = (dateRange,groupBy) =>{
    return {
        name: 'get-candidate-reports',
        text: adminQuery.candidateReports+dateRange+groupBy
    }
}