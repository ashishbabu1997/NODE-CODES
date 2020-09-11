
export default {
    getCandidateDetails:`select ca.billing_type as "billingTypeId",ca.currency_type_id as "currencyTypeId",ca.ellow_rate as "ellowRate",c.company_name as "companyName",ca.candidate_id ,ca.candidate_first_name as "candidateFirstName",ca.candidate_last_name as "candidateLastName",phsg.hiring_stage_name as "hiringStageName" ,chsg.hiring_status as "hiringStatus",phsg.hiring_stage_order as "hiringStageOrder",p.position_name as "positionName",ca.description as "description",ca.cover_note as "coverNote",ca.resume as "resume",ca.rate as "rate",ca.phone_number as "phoneNumber",ca.label as "label",ca.email_address as "emailAddress",ca.candidate_status as "candidateStatus" from candidate ca left join positions p on p.position_id = ca.position_id left join candidate_hiring_steps chs on chs.candidate_id  = ca.candidate_id left join candidate_hiring_stages chsg on chsg .candidate_hiring_step_id = chs .candidate_hiring_step_id left join position_hiring_stages phsg on phsg .position_hiring_stage_id  = chsg .position_hiring_stage_id left join company c on c.company_id = ca.company_id where ca.candidate_id  = $1 order by phsg .hiring_stage_order `,
    getPositionHiringStages: `select position_hiring_stage_id as "positionHiringStageId",hiring_stage_name as "positionHiringStageName" from positions p left join position_hiring_steps phs on phs.position_id = p.position_id left join position_hiring_stages phsg on phsg.position_hiring_step_id = phs.position_hiring_step_id and phsg.admin_stage_status = $2 where p.position_id = $1`,
    getCandidateNames:'SELECT c.candidate_first_name as "firstName",co.company_name as "companyName" FROM candidate c INNER JOIN company co ON co.company_id=c.company_id  WHERE c.candidate_id=$1',
    candidateSuperAdminApprovalQuery:'UPDATE candidate SET admin_approve_status=$2,admin_comment=$3,ellow_rate=$4,make_offer=$5 WHERE candidate_id=$1',
    candidateAdminApprovalQuery:'UPDATE candidate SET admin_approve_status=$2,hirer_comment=$3,make_offer=$4 WHERE candidate_id=$1',
    listCandidates: `select ca.admin_approve_status as "adminApproveStatus",ca.make_offer as "makeOffer",ca.rate,ca.ellow_rate as "ellowRate",ca.email_address as "email",ca.phone_number as "phoneNumber",ca.resume as "resume",p.position_name as  "positionName" ,c.company_name as "companyName",ca.candidate_first_name as "candidateFirstName",ca.candidate_last_name as "candidateLastName",ca.candidate_id as "candidateId",ca.candidate_status as "candidateStatus",ca.current_hiring_stage_id as "currentHiringStageId" from candidate ca left join company c on c.company_id = ca.company_id left join positions p on p.position_id = ca.position_id where ca.admin_approve_status = $2 and ca.position_id = $1 and ca.status = true and ca.candidate_status = 3`
}
