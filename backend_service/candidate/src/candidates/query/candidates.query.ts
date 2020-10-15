export default {
    getCandidateDetails: `select p.position_id as "positionId", ca.company_id as "companyId", cp.make_offer as "makeOffer", cp.admin_approve_status as "adminApproveStatus", ca.billing_type as "billingTypeId", ca.currency_type_id as "currencyTypeId", ca.work_experience as "workExperience", ca.ellow_rate as "defaultEllowRate", cp.ellow_rate as "ellowRate", c.company_name as "companyName", ca.candidate_id, ca.candidate_first_name as "firstName", ca.candidate_last_name as "lastName", p.position_name as "positionName", ca.description as "description", ca.cover_note as "coverNote", ca.resume as "resume", ca.rate as "rate", ca.phone_number as "phoneNumber", ca.label as "label", ca.email_address as "email", ca.candidate_status as "candidateStatus", ca.assessment_comment as "assessmentComment" from candidate ca left join candidate_position cp on cp.candidate_id = ca.candidate_id left join positions p on p.position_id = cp.position_id left join company c on c.company_id = ca.company_id where ca.candidate_id = $1 order by cp.created_on desc`,
    getJobReceivedId: 'SELECT job_received_id from job_received where position_id=$1',
    getPositionHiringStages: `select c.company_name as "companyName",p.position_name as "positionName",position_hiring_stage_id as "positionHiringStageId",hiring_stage_name as "positionHiringStageName" from positions p left join position_hiring_steps phs on phs.position_id = p.position_id left join position_hiring_stages phsg on phsg.position_hiring_step_id = phs.position_hiring_step_id and phsg.admin_stage_status = $2 left join company c on c.company_id = p.company_id where p.position_id = $1`,
    getCandidateNames: 'SELECT p.position_name as "positionName", c.job_received_id as "jobReceivedId", c.candidate_first_name as "firstName", c.candidate_last_name as "lastName", co.company_name as "companyName" FROM positions p,candidate c left JOIN company co ON co.company_id = c.company_id WHERE c.candidate_id = $1 and p.position_id=$2;',
    candidateSuperAdminApprovalQuery: 'UPDATE candidate_position SET admin_approve_status=$3, admin_comment=$4, updated_by=$5, updated_on=$6 WHERE candidate_id = $1 AND position_id=$2',
    candidateSuperAdminRejectQuery: 'UPDATE candidate SET admin_approve_status=$2,admin_comment=$3, updated_by=$4 WHERE candidate_id=$1',
    candidateAdminApprovalQuery: 'UPDATE candidate_position SET admin_approve_status=$3, hirer_comment=$4, make_offer=$5, updated_by=$6, updated_on=$7 WHERE candidate_id = $1 AND position_id=$2',
    listCandidates: `select cp.admin_approve_status as "adminApproveStatus", cp.make_offer as "makeOffer", ca.rate, cp.ellow_rate as "ellowRate", ca.email_address as "email", ca.phone_number as "phoneNumber", ca.resume as "resume", ca.currency_type_id as "currencyTypeId", ca.billing_type as "billingTypeId", p.position_name as "positionName", c.company_name as "companyName", ca.candidate_first_name as "candidateFirstName", ca.candidate_last_name as "candidateLastName", ca.candidate_id as "candidateId", ca.job_received_id as "jobReceivedId", ca.candidate_status as "candidateStatus" from candidate ca left join company c on c.company_id = ca.company_id left join candidate_position cp on ca.candidate_id = cp.candidate_id left join positions p on p.position_id = cp.position_id where cp.position_id = $1 and ca.status = true and ca.candidate_status IN (3, 4)`,
    insertMakeOfferStatus: 'UPDATE candidate_position SET make_offer=2,updated_by=$3,updated_on=$4 WHERE candidate_id=$1 and position_id=$2',
    getInterviewDetails: 'SELECT (SELECT company_name FROM company WHERE company_id = $2) as "hirerCompanyName", c.job_received_id as "jobReceivedId", c.candidate_first_name as "candidateFirstName", c.candidate_last_name as "candidateLastName", c.email_address as "emailAddress", c.phone_number as "phoneNumber", c.cover_note as "description", p.position_name as "positionName" FROM candidate c,positions p WHERE c.candidate_id = $1 and p.position_id=$3',
    updateCandidateAssesment: `update candidate_assesement set assesment_rating=$2,updated_by=$3,updated_on=$4 where candidate_assesment_id=$1`,
    updateAssessmentComment: 'UPDATE candidate set assessment_comment=$2 where candidate_id=$1',
    getAssessmentTraits: `select candidate_assesment_id as "assesmentId",assesement_trait as "reviewName",assesment_rating as "adminRating" from candidate_assesement where candidate_id=$1 and status=true`,
    getCandidateSkills : 'select cs.skill_id as "skillId",s.skill_name as "skillName" ,cs.top_rated_skill as "topSkill" from candidate_skill cs join skills s on s.skill_id = cs.skill_id  where cs.candidate_id=$1 and cs.status=true',
    listFreeCandidates:'select ca.rate, ca.ellow_rate as "ellowRate", ca.email_address as "email", ca.phone_number as "phoneNumber", ca.resume as "resume", ca.currency_type_id as "currencyTypeId", ca.billing_type as "billingTypeId", c.company_name as "companyName", ca.candidate_first_name as "candidateFirstName", ca.candidate_last_name as "candidateLastName", ca.candidate_id as "candidateId", ca.job_received_id as "jobReceivedId", ca.candidate_status as "candidateStatus", ca.candidate_vetted as "candidateVetted" from candidate ca left join company c on c.company_id = ca.company_id where ca.status = true and ca.candidate_id NOT IN (select candidate_id from candidate_position cp where cp.status=true)'
}
