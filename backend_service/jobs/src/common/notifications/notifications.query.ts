export default {
    createHirerNotification: `INSERT into hirer_notifications (position_id ,candidate_id, message, company_id, notification_type, created_on, updated_on,user_role_id,created_by ) values ($1, $2, $3, $4,$5, $6, $6, $7,$8)`,
    createNotification: `INSERT into notifications (position_id ,candidate_id, message, company_id, notification_type, created_on, updated_on,user_role_id,created_by ) values ($1, $2, $3, $4,$5, $6, $6, $7,$8)`
} 