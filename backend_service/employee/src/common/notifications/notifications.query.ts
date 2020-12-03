export default {
    createNotification: `INSERT into notifications (company_id, notification_type, created_on, updated_on,user_role_id ) values ($1, $2, $3, $3,$4)`
} 