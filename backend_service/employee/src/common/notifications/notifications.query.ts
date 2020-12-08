export default {
    createNotification: `INSERT into notifications (company_id, notification_type, created_on, updated_on,user_role_id,created_by,first_name,last_name ) values ($1, $2, $3, $3,$4,$5,$6,$7)`
} 