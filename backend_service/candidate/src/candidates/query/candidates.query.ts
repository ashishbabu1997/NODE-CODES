export default {
    listCandidateDetails: 'SELECT candidate_name as "candidateName",company_id as "companyId",position_id as "positionId",description as "description",cover_note as "coverNote",resume as "resume",rate as "rate",phone_number as "phoneNumber",label as "label",email_address as "emailAddress",status as "status",candidate_status as "candidateStatus",job_received_id as "jobReceivedId" FROM candidate where candidate_id=$1',
    listCandidates:'SELECT c.candidate_name as "candidateName" ,p.company_name as "companyName",s.position_name as "positionName",c.status as "status",c.candidate_status as "candidateStatus" FROM candidate c INNER JOIN company p ON p.company_id=c.company_id INNER JOIN positions s ON c.position_id=s.position_id WHERE c.company_id=$1 '
   
}