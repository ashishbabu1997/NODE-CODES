export default {
    listNotifications: `select position_id as "positionId",candidate_id as "candidateId",job_received_id as "jobReceivedId",message,company_id as "companyId",notification_id as "notificationId",notification_type as "notificationType" from notifications where status = true order by notification_id DESC`
}