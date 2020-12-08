export default {
    createNotification: `INSERT into notifications (position_id ,candidate_id, message, company_id, notification_type, job_received_id, created_on, updated_on,user_role_id ) values ($1, $2, $3, $4,$5, $6, $7, $7,$8)`
} 