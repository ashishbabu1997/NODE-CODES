export default {
    createNotification: `INSERT into notifications (company_id, notification_type, created_on, updated_on ) values ($1, $2, $3, $3)`
} 