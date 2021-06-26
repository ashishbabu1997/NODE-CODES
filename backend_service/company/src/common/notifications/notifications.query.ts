export default {
    createHirerNotification: `INSERT into hirer_notifications (position_id ,candidate_id, message, company_id, notification_type, job_received_id, created_on, updated_on,user_role_id,created_by ) values ($1, $2, $3, $4,$5, $6, $7, $7,$8,$9)`,
    createNotification: `INSERT into notifications (position_id ,candidate_id, message, company_id, notification_type, job_received_id, created_on, updated_on,user_role_id,created_by,image,first_name,last_name ) values ($1, $2, $3, $4,$5, $6, $7, $7,$8,$9,$10,$11,$12)`,
    createProviderNotification: `INSERT into notifications (candidate_id, message, company_id, notification_type, created_on, updated_on,user_role_id,created_by,image,first_name,last_name ) values ($1, $2, $3, $4,$5, $5, $6, $7,$8,$9,$10)`

} 