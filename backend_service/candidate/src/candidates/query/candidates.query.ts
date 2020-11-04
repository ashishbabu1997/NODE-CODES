export default {
    getCandidateDetails: `select p.position_id as "positionId", ca.company_id as "companyId", cp.make_offer as "makeOffer", cp.admin_approve_status as "adminApproveStatus", ca.billing_type as "billingTypeId", ca.currency_type_id as "currencyTypeId", ca.work_experience as "workExperience", ca.ellow_rate as "defaultEllowRate", cp.ellow_rate as "ellowRate", c.company_name as "companyName", ca.candidate_id, ca.candidate_first_name as "firstName", ca.candidate_last_name as "lastName", p.position_name as "positionName", ca.description as "description", ca.cover_note as "coverNote", ca.resume as "resume", ca.rate as "rate", ca.phone_number as "phoneNumber", ca.label as "label", ca.email_address as "email", ca.candidate_status as "candidateStatus", ca.assessment_comment as "assessmentComment" from candidate ca left join candidate_position cp on cp.candidate_id = ca.candidate_id left join positions p on p.position_id = cp.position_id left join company c on c.company_id = ca.company_id where ca.candidate_id = $1 order by cp.created_on desc`,
    getJobReceivedId: 'SELECT job_received_id from job_received where position_id=$1',
    getPositionHiringStages: `select c.company_name as "companyName",p.position_name as "positionName",position_hiring_stage_id as "positionHiringStageId",hiring_stage_name as "positionHiringStageName" from positions p left join position_hiring_steps phs on phs.position_id = p.position_id left join position_hiring_stages phsg on phsg.position_hiring_step_id = phs.position_hiring_step_id and phsg.admin_stage_status = $2 left join company c on c.company_id = p.company_id where p.position_id = $1`,
    getCandidateNames: 'SELECT p.position_name as "positionName", c.job_received_id as "jobReceivedId", c.candidate_first_name as "firstName", c.candidate_last_name as "lastName", co.company_name as "companyName" FROM positions p,candidate c left JOIN company co ON co.company_id = c.company_id WHERE c.candidate_id = $1 and p.position_id=$2',
    candidateSuperAdminApprovalQuery: 'UPDATE candidate_position SET admin_approve_status=$3, admin_comment=$4, ellow_rate=$5, updated_by=$6, updated_on=$7 WHERE candidate_id = $1 AND position_id = $2',
    candidateSuperAdminRejectQuery: 'UPDATE candidate_position SET admin_approve_status=$3, admin_comment=$4, updated_by=$5, updated_on=$6 WHERE candidate_id = $1 and position_id=$2',
    candidateAdminApprovalQuery: 'UPDATE candidate_position SET admin_approve_status=$3, hirer_comment=$4, make_offer=$5, updated_by=$6, updated_on=$7 WHERE candidate_id = $1 AND position_id=$2',
    listCandidates: `select cp.admin_approve_status as "adminApproveStatus", cp.make_offer as "makeOffer", ca.rate, ca.created_by, cp.ellow_rate as "ellowRate", ca.email_address as "email", ca.phone_number as "phoneNumber", ca.resume as "resume", ca.currency_type_id as "currencyTypeId", ca.billing_type as "billingTypeId", p.position_name as "positionName", p.position_id as "positionId", c.company_name as "companyName", ca.candidate_first_name as "candidateFirstName", ca.candidate_last_name as "candidateLastName", ca.candidate_id as "candidateId", ca.job_received_id as "jobReceivedId", ca.candidate_status as "candidateStatus" from candidate ca join company c on c.company_id = ca.company_id join candidate_position cp on ca.candidate_id = cp.candidate_id join positions p on p.position_id = cp.position_id where cp.position_id = $1 and ca.status = true and cp.status=true and (ca.candidate_status = 3 or(ca.candidate_status = 4 and ca.created_by=$2))`,
    insertMakeOfferStatus: 'UPDATE candidate_position SET make_offer=2,updated_by=$3,updated_on=$4 WHERE candidate_id=$1 and position_id=$2',
    getInterviewDetails: 'SELECT (SELECT company_name FROM company WHERE company_id = $2) as "hirerCompanyName", c.job_received_id as "jobReceivedId", c.candidate_first_name as "candidateFirstName", c.candidate_last_name as "candidateLastName", c.email_address as "emailAddress", c.phone_number as "phoneNumber", c.cover_note as "description", p.position_name as "positionName" FROM candidate c,positions p WHERE c.candidate_id = $1 and p.position_id=$3',
    updateCandidateAssesment: `update candidate_assesement set assesment_rating=$2,updated_by=$3,updated_on=$4 where candidate_assesment_id=$1`,
    updateAssessmentComment: 'UPDATE candidate set assessment_comment=$2 where candidate_id=$1',
    getAssessmentTraits: `select candidate_assesment_id as "assesmentId",assesement_trait as "reviewName",assesment_rating as "adminRating" from candidate_assesement where candidate_id=$1 and status=true`,
    getCandidateSkills: 'select cs.skill_id as "skillId",s.skill_name as "skillName",cs.preferred as "preferred",cs.competency as "competency",cs.years_of_experience as "yoe" from candidate_skill cs join skills s on s.skill_id = cs.skill_id  where cs.candidate_id=$1 and cs.status=true',
    listFreeCandidates: 'select ca.rate, ca.ellow_rate as "ellowRate", ca.email_address as "email", ca.phone_number as "phoneNumber", ca.resume as "resume", ca.currency_type_id as "currencyTypeId", ca.billing_type as "billingTypeId", c.company_name as "companyName", ca.candidate_first_name as "candidateFirstName", ca.candidate_last_name as "candidateLastName", ca.candidate_id as "candidateId", ca.job_received_id as "jobReceivedId", ca.candidate_status as "candidateStatus", ca.candidate_vetted as "candidateVetted", ca.created_by as "createdBy", ca.work_experience as "workExperience",Array(select s.skill_name from candidate_skill cs left join skills s on cs.skill_id = s.skill_id where cs.preferred = true and cs.candidate_id=ca.candidate_id and cs.status = true) as skills,Array(select p.position_id from candidate_position cp left join positions p on p.position_id = cp.position_id where cp.candidate_id =ca.candidate_id and cp.status = true) as positions from candidate ca left join company c on c.company_id = ca.company_id where ca.status = true',
    updateCandidateVetting: 'UPDATE candidate set candidate_vetted=$2,updated_by=$3,updated_on=$4 where candidate_id=$1;',
    deleteCandidateFromPosition: `UPDATE candidate_position set status= false,updated_by=$3,updated_on=$4 where candidate_id=$1 and position_id = $2`,
    getSellerMail: 'SELECT e.email as "email",c.candidate_first_name as "cFirstName",c.candidate_last_name as "cLastName" FROM employee e LEFT JOIN candidate c ON c.company_id=e.company_id WHERE c.candidate_id=$1',
    getPositionDetails: 'SELECT p.position_name as "positionName",c.company_name as "hirerName",j.job_received_id as "jobReceivedId" FROM positions p LEFT JOIN company c ON c.company_id=p.company_id LEFT JOIN job_received j ON j.position_id=p.position_id WHERE p.position_id=$1',
    linkCandidateWithPosition: `INSERT INTO candidate_position(position_id, candidate_id, job_receievd_id, billing_type, currency_type_id, created_by, updated_by, created_on, updated_on) select position_id, $2, job_category_id, billing_type, currency_type_id, $3, $3, $4, $4 from positions where position_id = $1 on conflict on constraint candidate_position_candidate_id_position_id_unique_key do update set updated_on=$4, updated_by=$3, status= true`,
    updateSellerRate: `update candidate set rate=$2,updated_by=$3,updated_on=$4 where candidate_id=$1`,
    deleteCandidate: `update candidate set status = false, updated_on=$2, updated_by = $3 where candidate_id = $1`,
    
    modifyLanguageProficiency: `update candidate_language set candidate_id = $2, language_name = $3, proficiency = $4, updated_on = $5, updated_by = $6 where candidate_language_id = $1`,
    insertLanguageProficiency:'insert into candidate_language (candidate_id, language_name, proficiency, created_by, updated_by, created_on, updated_on) values($1,$2,$3,$4,$4,$5,$5)',
    deleteLanguageProficiency:'update candidate_language set status = false, updated_on = $2, updated_by = $3 where candidate_language_id = $1',
    
    modifyCandidateAvailability: `update candidate set availability = $2, type_of_availability = $3, ready_to_start = $4, updated_on=$5, updated_by = $6 where candidate_id = $1`,
    modifyProfileDetails : 'update candidate set candidate_first_name = $2, candidate_last_name = $3, description = $4, image = $5, citizenship = $6, residence = $7, phone_number = $7, email_address = $9, updated_on = $10, updated_by = $11 where candidate_id = $1',

    modifyCandidateProject: `update candidate_project set candidate_id = $2, project_name = $3, company_name = $4, project_description = $5, project_link = $6, side_project = $7, skills = $8, updated_on = $9, updated_by = $10 where candidate_project_id = $1`,
    insertCandidateProject:'insert into candidate_project (candidate_id, project_name,company_name, project_description, project_link, side_project, skills, created_by, updated_by, created_on, updated_on ) values ($1,$2,$3,$4,$5,$6,$7,$8,$8,$9,$9)',
    deleteCandidateProject:'update candidate_project set status = false, updated_on = $2, updated_by = $3 where candidate_project_id = $1',
    // _body.candidateWorkExperienceId,_body.candidateId,_body.positionName,_body.companyName,_body.description,_body.logo,_body.startDate,_body.endDate,_body.stillWorking,currentTime,_body.employeeid
    modifyCandidateWorkHistory: `update candidate_work_experience set candidate_id = $2, candidate_position_name = $3, candidate_company_name = $4, description = $5, logo = $6, start_date = $7, end_date = $8, still_working = $9, updated_on = $10,updated_by=$11 where candidate_work_experience_id = $1`,
    insertCandidateWorkHistory:'insert into candidate_work_experience (candidate_id, candidate_position_name, candidate_company_name, description, logo, start_date, end_date, still_working, created_by, updated_by, created_on, updated_on) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$9,$10,$10)',
    deleteCandidateWorkHistory:'update candidate_work_experience set status=false, updated_on=$2, updated_by=$3 where candidate_work_experience_id = $1',
    
    modifyCandidateEducation: `update candidate_education set candidate_id=$2, degree = $3, college = $4, start_date = $5, end_date = $6, updated_on = $7, updated_by = $8 where candidate_education_id = $1`,
    insertCandidateEducation:'insert INTO candidate_education (candidate_id, degree, college, start_date, end_date, created_by, updated_by, created_on, updated_on) values ($1,$2,$3,$4,$5,$6,$6,$7,$7)',
    deleteCandidateEducation:'update candidate_education set status= false, updated_on = $2, updated_by = $3 where candidate_education_id = $1',
    
    modifyCandidatePublication: `update candidate_publication set candidate_id=$2, title = $3, published_year = $4, link = $5, updated_on = $6, updated_by = $7 where candidate_publication_id = $1`,
    insertCandidatePublication:'insert into candidate_publication (candidate_id, title, published_year, link, created_by, updated_by, created_on, updated_on) values ($1,$2,$3,$4,$5,$5,$6,$6)',
    deleteCandidatePublication:'update candidate_publication set status=false, updated_on = $2, updated_by = $3 where candidate_publication_id = $1',
    
    modifyCloudAndSocial:'update candidate set github_id=$2, stackoverflow_id=$3, kaggle_id=$4, linked_in_id=$5, cloud_proficiency=$6, updated_on=$7, updated_by=$8 where candidate_id=$1',
    modifyCandidateAward: `update candidate_certifications set candidate_id=$2, certification_id = $3, certified_year = $4, updated_on = $5, updated_by = $6 where candidate_certification_id = $1`,
    insertCandidateAward:'insert into candidate_certifications(candidate_id, certification_id, certified_year, created_by, updated_by, created_on, updated_on) values ($1,$2,$3,$4,$4,$5,$5)',
    deleteCandidateAward:'update candidate_certifications set status=false, updated_on = $2, updated_by = $3 where candidate_certification_id = $1',

    modifyResumeFile:'update candidate set resume=$2,updated_on=$3,updated_by=$4 where candidate_id=$1',


    getAllProfileDetails:'select candidate_first_name as "firstName", candidate_last_name as "lastName", description, resume as "resume", candidate_status as "candidateStatus", rate, work_experience as "workExperience", remote_work_experience as "remoteWorkExperience", company_id as "sellerCompanyId", image, citizenship, residence, phone_number as "phoneNumber", email_address as "email", billing_type as "billingTypeId", currency_type_id as "currencyTypeId", candidate_position_name as "candidatePositionName", candidate_vetted as "candidateVetted", kaggle_id as "kaggleId", stackoverflow_id as "stackoverflowId", linked_in_id as "linkedInId", github_id as "githubId", cloud_proficiency as "cloudProficiency", availability, type_of_availability as "typeOfAvailability", ready_to_start as "readyToStart" from candidate where candidate_id = $1',
    fetchSkillDetails:'select candidate_skill_id as "candidateSkillId", candidate_id as "candidateId", preferred, competency, skill_version as "skillVersion", years_of_experience as "yoe", json_build_object(\'skillId\', s.skill_id, \'skillName\', s.skill_name) as skill from candidate_skill cs left join skills s on cs.skill_id = s.skill_id where candidate_id = $1 and cs.status = true group by cs.candidate_skill_id, s.skill_id, s.skill_name',
    fetchProjectDetails:'select candidate_project_id as "candidateProjectId", candidate_id as "candidateId", project_name as "projectName", company_name as "companyName", project_description as "projectDescription", project_link as "projectLink", skills, side_project as "extraProject" from candidate_project where candidate_id = $1 and status = true',
    fetchAssesmentDetails:'select candidate_assesment_id as "candidateAssesmentId", candidate_id as "candidateId", assesement_trait as "assesmentComment", assesment_rating as "rating", assesement_type as "assementType" from candidate_assesement where candidate_id = $1 and status = true',
    fetchWorkExperienceDetails:'select candidate_work_experience_id as "candidateWorkExperienceId", candidate_id as "candidateId", candidate_position_name as "positionName", candidate_company_name as "companyName", description, logo, still_working as "stillWorking", start_date as "startDate", end_date as "endDate" from candidate_work_experience where candidate_id = $1 and status = true',
    fetchEducationDetails:'select candidate_education_id as "candidateEducationId", candidate_id as "candidateId", degree, college, start_date as "startDate", end_date as "endDate" from candidate_education where candidate_id = $1 and status = true',
    fetchPublicationDetails:'select candidate_publication_id as "candidatePublicationId", candidate_id as "candidateId", title, published_year as "publishedYear", link from candidate_publication where candidate_id = $1 and status = true',
    fetchAwardDetails:'select candidate_certification_id as "candidateAwardId", candidate_id as "candidateId", certification_id as "certificationId", certified_year as "certifiedYear" from candidate_certifications where candidate_id = $1 and status = true',
    fetchLanguageDetails:'select candidate_language_id as "candidateLanguageId", candidate_id as "candidateId", language_name as "languageName", proficiency from candidate_language where candidate_id = $1 and status = true',
    addExperience:'update candidate set work_experience=$2, remote_work_experience=$3, candidate_position_name=$4, rate=$5, billing_type=$6, currency_type_id=$7, updated_on=$8, updated_by=$9 where candidate_id = $1'
}