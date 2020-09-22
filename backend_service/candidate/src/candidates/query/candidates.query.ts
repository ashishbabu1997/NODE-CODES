export default {
    getCandidateDetails: `select ca.position_id as "positionId",ca.company_id as "companyId",ca.make_offer as "makeOffer",ca.admin_approve_status as "adminApproveStatus",ca.billing_type as "billingTypeId",ca.currency_type_id as "currencyTypeId",ca.ellow_rate as "ellowRate",c.company_name as "companyName",ca.candidate_id ,ca.candidate_first_name as "candidateFirstName",ca.candidate_last_name as "candidateLastName",phsg.hiring_stage_name as "hiringStageName" ,chsg.hiring_status as "hiringStatus",phsg.hiring_stage_order as "hiringStageOrder",p.position_name as "positionName",ca.description as "description",ca.cover_note as "coverNote",ca.resume as "resume",ca.rate as "rate",ca.phone_number as "phoneNumber",ca.label as "label",ca.email_address as "emailAddress",ca.candidate_status as "candidateStatus" from candidate ca left join positions p on p.position_id = ca.position_id left join candidate_hiring_steps chs on chs.candidate_id  = ca.candidate_id left join candidate_hiring_stages chsg on chsg .candidate_hiring_step_id = chs .candidate_hiring_step_id left join position_hiring_stages phsg on phsg .position_hiring_stage_id  = chsg .position_hiring_stage_id left join company c on c.company_id = ca.company_id  where ca.candidate_id  = $1 order by phsg .hiring_stage_order `,
    getPositionHiringStages: `select c.company_name as "companyName",p.position_name as "positionName",position_hiring_stage_id as "positionHiringStageId",hiring_stage_name as "positionHiringStageName" from positions p left join position_hiring_steps phs on phs.position_id = p.position_id left join position_hiring_stages phsg on phsg.position_hiring_step_id = phs.position_hiring_step_id and phsg.admin_stage_status = $2 left join company c on c.company_id = p.company_id where p.position_id = $1`,
    getCandidateNames: 'SELECT c.candidate_first_name as "firstName",co.company_name as "companyName" FROM candidate c INNER JOIN company co ON co.company_id=c.company_id  WHERE c.candidate_id=$1',
    candidateSuperAdminApprovalQuery: 'UPDATE candidate SET admin_approve_status=$2,admin_comment=$3,ellow_rate=$4 WHERE candidate_id=$1',
    candidateSuperAdminRejectQuery: 'UPDATE candidate SET admin_approve_status=$2,admin_comment=$3 WHERE candidate_id=$1',
    candidateAdminApprovalQuery: 'UPDATE candidate SET admin_approve_status=$2,hirer_comment=$3,make_offer=$4 WHERE candidate_id=$1',
    listCandidates: `select ca.admin_approve_status as "adminApproveStatus",ca.make_offer as "makeOffer",ca.rate,ca.ellow_rate as "ellowRate",ca.email_address as "email",ca.phone_number as "phoneNumber",ca.resume as "resume",p.position_name as  "positionName" ,c.company_name as "companyName",ca.candidate_first_name as "candidateFirstName",ca.candidate_last_name as "candidateLastName",ca.candidate_id as "candidateId",ca.candidate_status as "candidateStatus",ca.current_hiring_stage_id as "currentHiringStageId" from candidate ca left join company c on c.company_id = ca.company_id left join positions p on p.position_id = ca.position_id where ca.position_id = $1 and ca.status = true and ca.candidate_status = 3`,
    insertMakeOfferStatus: 'UPDATE candidate SET make_offer=2 WHERE candidate_id=$1',
    getInterviewDetails: 'SELECT (SELECT company_name FROM company WHERE company_id=$2) as "hirerCompanyName",c.candidate_first_name as "candidateFirstName",c.candidate_last_name as "candidateLastName",c.email_address as "emailAddress",c.phone_number as "phoneNumber",c.description as "description",p.position_name as "positionName" FROM candidate c INNER JOIN positions p ON p.position_id=c.position_id WHERE candidate_id=$1 ',
    updateCandidateReview: `INSERT into candidate_review (candidate_id,position_review_id,admin_rating,admin_comments,created_on ,updated_on ) values ($1,$2,$3,$4,$5,$5 ) ON CONFLICT ON CONSTRAINT candidate_id_position_review_id_uniqueKey DO UPDATE  SET admin_rating= $3 , admin_comments = $4`,
    getAssessmentTraits:`select cr.admin_rating as "adminRating",cr.admin_comments as "adminComments",pr.position_review_id as "positionReviewId",pr.review_name as "reviewName" from  position_review pr left join candidate_review cr on cr .position_review_id =pr.position_review_id and cr.candidate_id = $1 where pr.position_id = $2`
}
