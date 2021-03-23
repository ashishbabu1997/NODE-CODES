import notificationsQuery from '../notifications/query/notifications.query';


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
