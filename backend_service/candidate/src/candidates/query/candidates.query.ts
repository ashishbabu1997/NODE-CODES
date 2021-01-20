import { changeAssignee } from "../candidates.manager";

export default {
    getCandidateDetails: `select p.position_id as "positionId", ca.company_id as "companyId", cp.make_offer as "makeOffer", cp.admin_approve_status as "adminApproveStatus", ca.billing_type as "billingTypeId", ca.currency_type_id as "currencyTypeId", ca.work_experience as "workExperience", ca.ellow_rate as "defaultEllowRate", cp.ellow_rate as "ellowRate", c.company_name as "companyName", ca.candidate_id, ca.candidate_first_name as "firstName", ca.candidate_last_name as "lastName", p.position_name as "positionName", ca.description as "description", ca.cover_note as "coverNote", ca.resume as "resume", ca.rate as "rate", ca.phone_number as "phoneNumber", ca.label as "label", ca.email_address as "email", ca.candidate_status as "candidateStatus", ca.assessment_comment as "assessmentComment" from candidate ca left join candidate_position cp on cp.candidate_id = ca.candidate_id left join positions p on p.position_id = cp.position_id left join company c on c.company_id = ca.company_id where ca.candidate_id = $1 order by cp.created_on desc`,
    getJobReceivedId: 'SELECT job_received_id from job_received where position_id=$1',
    getCandidateNames: 'SELECT p.position_name as "positionName", c.job_received_id as "jobReceivedId", c.candidate_first_name as "firstName", c.candidate_last_name as "lastName", co.company_name as "companyName" FROM positions p,candidate c left JOIN company co ON co.company_id = c.company_id WHERE c.candidate_id = $1 and p.position_id=$2',
    candidateSuperAdminApprovalQuery: 'UPDATE candidate_position SET admin_approve_status=$3, admin_comment=$4, ellow_rate=$5, updated_by=$6, updated_on=$7 WHERE candidate_id = $1 AND position_id = $2',
    candidateSuperAdminRejectQuery: 'UPDATE candidate_position SET admin_approve_status=$3, admin_comment=$4, updated_by=$5, updated_on=$6 WHERE candidate_id = $1 and position_id=$2',
    candidateAdminApprovalQuery: 'UPDATE candidate_position SET admin_approve_status=$3, hirer_comment=$4, make_offer=$5, updated_by=$6, updated_on=$7 WHERE candidate_id = $1 AND position_id=$2',
    listCandidates: `select cp.admin_approve_status as "adminApproveStatus", cp.make_offer as "makeOffer", ca.rate, ca.created_by, cp.ellow_rate as "ellowRate", ca.email_address as "email", ca.phone_number as "phoneNumber", ca.resume as "resume", ca.currency_type_id as "currencyTypeId", ca.billing_type as "billingTypeId", p.position_name as "positionName", p.position_id as "positionId", c.company_name as "companyName", ca.candidate_first_name as "candidateFirstName", ca.candidate_last_name as "candidateLastName", ca.candidate_id as "candidateId", ca.job_received_id as "jobReceivedId", ca.candidate_status as "candidateStatus", (case when ca.current_ellow_stage > 0 and ca.current_ellow_stage < 6 then case when 2 = (select stage_status from candidate_assesement cas left join review_steps rs on ca.current_ellow_stage = rs.review_steps_id where cas.candidate_id = ca.candidate_id and cas.stage_name = rs.stage_name) then concat((select stage_name from review_steps where ca.current_ellow_stage = review_steps_id), \' \', \'Completed\') else case when 1 = (select stage_status from candidate_assesement cas left join review_steps rs on ca.current_ellow_stage = rs.review_steps_id where cas.candidate_id = ca.candidate_id and cas.stage_name = rs.stage_name) then concat( (select stage_name from review_steps where ca.current_ellow_stage = review_steps_id), \' \', \'Scheduled\') else case when 0 = (select stage_status from candidate_assesement cas left join review_steps rs on ca.current_ellow_stage = rs.review_steps_id where cas.candidate_id = ca.candidate_id and cas.stage_name = rs.stage_name) then \'Rejected\' end end end else case when ca.current_ellow_stage = 6 then case when 1 = (select assessment_rating from candidate_assesement cas where cas.candidate_id = ca.candidate_id and cas.stage_name = \'ellow Onboarding\') then \'ellow Certified And Vetted\' else \'Vetted\' end end end) as "stageStatusName", (case when cp.current_stage = \'Make offer\' then case when 0 = (select cchs.step_status from candidate_client_hiring_step cchs where cchs.candidate_id = ca.candidate_id and cchs.candidate_hiring_step_name = \'Make offer\' and cchs.position_id = cp.position_id) then \'Rejected\' else case when 2 = (select cchs.step_status from candidate_client_hiring_step cchs where cchs.candidate_id = ca.candidate_id and cchs.candidate_hiring_step_name = \'Make offer\' and cchs.position_id = cp.position_id) then \'Selected\' else \'Make offer\' end end else case when cp.current_stage = \'Negotiation/Close position\' then case when 1 = (select cchs.step_status from candidate_client_hiring_step cchs where cchs.candidate_id = ca.candidate_id and cchs.candidate_hiring_step_name = \'Negotiation/Close position\' and cchs.position_id = cp.position_id) then \'Negotiation/Close position\' else case when 2 = (select cchs.hiring_assesment_value from candidate_client_hiring_step cchs where cchs.candidate_id = ca.candidate_id and cchs.candidate_hiring_step_name = \'Negotiation/Close position\' and cchs.position_id = cp.position_id) then \'Ellow rejected offer\' else case when 1 = (select cchs.hiring_assesment_value from candidate_client_hiring_step cchs where cchs.candidate_id = ca.candidate_id and cchs.candidate_hiring_step_name = \'Negotiation/Close position\' and cchs.position_id = cp.position_id) then \'Resource rejected offer\' else \'Resource accepted offer\' end end end else case when cp.current_stage != \'Negotiation/Close position\' and cp.current_stage != \'Make offer\' then case when 2 = (select cchs.step_status from candidate_client_hiring_step cchs where cchs.candidate_id = ca.candidate_id and cchs.candidate_hiring_step_name = cp.current_stage and cchs.position_id = cp.position_id) then concat(cp.current_stage, \' \', \'Completed\') else case when 0 = (select cchs.step_status from candidate_client_hiring_step cchs where cchs.candidate_id = ca.candidate_id and cchs.candidate_hiring_step_name = cp.current_stage and cchs.position_id = cp.position_id) then \'Rejected\' else concat(cp.current_stage, \' \', \'Scheduled\') end end end end end) as positionStatusName from candidate ca join company c on c.company_id = ca.company_id join candidate_position cp on ca.candidate_id = cp.candidate_id join positions p on p.position_id = cp.position_id where cp.position_id = $positionid and ca.status = true and cp.status = true and (ca.candidate_status = 3 or (ca.candidate_status = 4 and ca.created_by = $employeeid))`,
    insertMakeOfferStatus: 'UPDATE candidate_position SET make_offer=2,updated_by=$3,updated_on=$4 WHERE candidate_id=$1 and position_id=$2',
    getInterviewDetails: 'SELECT (SELECT company_name FROM company WHERE company_id = $2) as "hirerCompanyName", c.job_received_id as "jobReceivedId", c.candidate_first_name as "candidateFirstName", c.candidate_last_name as "candidateLastName", c.email_address as "emailAddress", c.phone_number as "phoneNumber", c.cover_note as "description", p.position_name as "positionName" FROM candidate c,positions p WHERE c.candidate_id = $1 and p.position_id=$3',
    
    updateEllowRecuiterReview:'update candidate_assesement SET assessment_comment=$assessmentcomment, assessment_link=$link, assesment_attachments=$attachments, assigned_to=$assignedto, assessment_rating=$rating, assessment_link_text=$linktext, updated_by=$employeeid, updated_on=$currenttime, stage_status = case when stage_status!=0 then 2 else stage_status end where candidate_assesment_id=$assessmentid returning candidate_id',
    setVettedStatus : 'update candidate set candidate_vetted=6,current_ellow_stage=6,updated_by=$employeeid,updated_on=$currenttime where candidate_id=$candidateid',
    updateCandidateAssesment: `update candidate_assesement set assesment_rating=$2,updated_by=$3,updated_on=$4 where candidate_assesment_id=$1`,
    updateAssessmentComment: 'UPDATE candidate set assessment_comment=$2,code_test_link=$3,interview_test_link=$4,updated_by = $5, updated_on = $6 where candidate_id=$1',
    getAssessmentTraits: `select candidate_assesment_id as "assesmentId",assesement_trait as "reviewName",assesment_rating as "adminRating" from candidate_assesement where candidate_id=$1 and status=true`,
    getCandidateSkills: 'select cs.skill_id as "skillId",s.skill_name as "skillName",cs.preferred as "preferred",cs.competency as "competency",cs.years_of_experience as "yoe" from candidate_skill cs join skills s on s.skill_id = cs.skill_id  where cs.candidate_id=$1 and cs.status=true',
    listFreeCandidatesFromView:'select distinct chsv."candidateId", chsv.availability, chsv."availabilityType", chsv."allocatedTo", chsv."ellowRate", chsv."email", chsv."phoneNumber", chsv."createdOn", chsv."updatedOn", chsv."resume", chsv."currencyTypeId", chsv."billingTypeId", chsv."companyId", chsv."companyName", chsv."candidateFirstName", chsv."candidateLastName", chsv."rate", chsv."candidateStatus", chsv."candidateVetted", chsv."stageStatusName", chsv."createdBy", chsv."residence", chsv."workExperience", (select array( (select jsonb_build_object(\'positionId\', chsv2."positionId", \'positionName\', chsv2."positionName", \'jobReceivedId\', chsv2."jobReceivedId", \'companyName\', chsv2."hirerCompanyName", \'assignedTo\', chsv2."assignedTo", \'makeOffer\', chsv2."makeOffer", \'positionStatusName\', chsv2."positionStatusName") from candidate_hiring_steps_view chsv2 where chsv2."candidateId" = chsv."candidateId" and chsv2."positionId" is not null)) as positions), chsv."skills", chsv.otherskills as "otherSkills" from candidate_hiring_steps_view chsv',
    listFreeCandidatesOfHirerFromView:'select distinct chsv."candidateId", chsv."hirerCompanyId", chsv.availability, chsv."availabilityType", chsv."allocatedTo", chsv."ellowRate", chsv."email", chsv."phoneNumber", chsv."createdOn", chsv."updatedOn", chsv."resume", chsv."currencyTypeId", chsv."billingTypeId", chsv."companyId", chsv."companyName", chsv."candidateFirstName", chsv."candidateLastName", chsv."rate", chsv."candidateStatus", chsv."candidateVetted", chsv."stageStatusName", chsv."createdBy", chsv."residence", chsv."workExperience", (select array( (select jsonb_build_object(\'positionId\', chsv2."positionId", \'positionName\', chsv2."positionName", \'jobReceivedId\', chsv2."jobReceivedId", \'companyName\', chsv2."hirerCompanyName", \'assignedTo\', chsv2."assignedTo", \'makeOffer\', chsv2."makeOffer", \'positionStatusName\', chsv2."positionStatusName") from candidate_hiring_steps_view chsv2 where chsv2."candidateId" = chsv."candidateId" and chsv2."hirerCompanyId" = chsv."hirerCompanyId")) as positions), chsv."skills", chsv.otherskills as "otherSkills" from candidate_hiring_steps_view chsv where chsv."hirerCompanyId" =$hirercompanyid',
    updateCandidateVetting: 'UPDATE candidate set candidate_vetted=$2,updated_by=$3,updated_on=$4 where candidate_id=$1;',
    deleteCandidateFromPosition: `delete from candidate_position where candidate_id = $1 and position_id = $2`,
    getSellerMail: 'SELECT e.email as "email",c.candidate_first_name as "cFirstName",c.candidate_last_name as "cLastName" FROM employee e LEFT JOIN candidate c ON c.company_id=e.company_id WHERE c.candidate_id=$1',
    getPositionDetails: 'SELECT p.position_name as "positionName",c.company_name as "hirerName",j.job_received_id as "jobReceivedId" FROM positions p LEFT JOIN company c ON c.company_id=p.company_id LEFT JOIN job_received j ON j.position_id=p.position_id WHERE p.position_id=$1',
    linkCandidateWithPosition: `INSERT INTO candidate_position(position_id, candidate_id, job_receievd_id, billing_type, currency_type_id, created_by, updated_by, created_on, updated_on) select position_id, $2, job_category_id, billing_type, currency_type_id, $3, $3, $4, $4 from positions where position_id = $1 on conflict on constraint candidate_position_candidate_id_position_id_unique_key do update set updated_on=$4, updated_by=$3, status= true`,
    linkCandidateWithPositionByAdmin:`INSERT INTO candidate_position(position_id, candidate_id, job_receievd_id,created_by, updated_by, created_on, updated_on,ellow_rate,currency_type_id,billing_type,admin_comment,admin_approve_status ) select position_id, $2, job_category_id,$3, $3, $4, $4,$5,$6,$7,$8,$9 from positions where position_id = $1 on conflict on constraint candidate_position_candidate_id_position_id_unique_key do update set updated_on=$4, updated_by=$3,ellow_rate=$5,currency_type_id=$6,billing_type=$7,admin_comment=$8,admin_approve_status=$9, status= true`,

    deleteCandidate: `update candidate set status = false, updated_on=$2, updated_by = $3 where candidate_id = $1`,
    
    modifyLanguageProficiency: `update candidate_language set candidate_id = $2, language_id = $3, proficiency = $4, updated_on = $5, updated_by = $6 where candidate_language_id = $1`,
    insertLanguageProficiency:'insert into candidate_language (candidate_id, language_id, proficiency, created_by, updated_by, created_on, updated_on) values($1,$2,$3,$4,$4,$5,$5)',
    deleteLanguageProficiency:'update candidate_language set status = false, updated_on = $2, updated_by = $3 where candidate_language_id = $1',
    
    modifyCandidateAvailability: `update candidate set availability = $2, type_of_availability = $3, ready_to_start = $4, updated_on=$5, updated_by = $6 where candidate_id = $1`,
    modifyProfileDetails : 'update candidate set candidate_first_name = $2, candidate_last_name = $3, cover_note = $4, image = $5, citizenship = $6, residence = $7, phone_number = $8, email_address = $9, updated_on = $10, updated_by = $11,candidate_position_name=$12 where candidate_id = $1',

    modifyCandidateProject: `update candidate_project set candidate_id = $2, project_name = $3, company_name = $4, project_description = $5, project_link = $6, side_project = $7, skills = $8, updated_on = $9, updated_by = $10,contribution=$11,done_for=$12,role=$13 where candidate_project_id = $1`,
    insertCandidateProject:'insert into candidate_project (candidate_id, project_name,company_name, project_description, project_link, side_project, skills, created_by, updated_by, created_on, updated_on,contribution,done_for,role ) values ($1,$2,$3,$4,$5,$6,$7,$8,$8,$9,$9,$10,$11,$12)',
    deleteCandidateProject:'update candidate_project set status = false, updated_on = $2, updated_by = $3 where candidate_project_id = $1',
    // _body.candidateWorkExperienceId,_body.candidateId,_body.positionName,_body.companyName,_body.description,_body.logo,_body.startDate,_body.endDate,_body.stillWorking,currentTime,_body.employeeid
    modifyCandidateWorkHistory: `update candidate_work_experience set candidate_id = $2, candidate_company_name = $3, description = $4, logo = $5, start_date = $6, end_date = $7, still_working = $8, updated_on = $9,updated_by=$10,candidate_position_name=$11 where candidate_work_experience_id = $1`,
    insertCandidateWorkHistory:'insert into candidate_work_experience (candidate_id, candidate_company_name, description, logo, start_date, end_date, still_working, created_by, updated_by, created_on, updated_on,candidate_position_name) values($1,$2,$3,$4,$5,$6,$7,$8,$8,$9,$9,$10)',
    deleteCandidateWorkHistory:'update candidate_work_experience set status=false, updated_on=$2, updated_by=$3 where candidate_work_experience_id = $1',
    
    modifyCandidateEducation: `update candidate_education set candidate_id=$2, degree = $3, college = $4, start_date = $5, end_date = $6, updated_on = $7, updated_by = $8 where candidate_education_id = $1`,
    insertCandidateEducation:'insert INTO candidate_education (candidate_id, degree, college, start_date, end_date, created_by, updated_by, created_on, updated_on) values ($1,$2,$3,$4,$5,$6,$6,$7,$7)',
    deleteCandidateEducation:'update candidate_education set status= false, updated_on = $2, updated_by = $3 where candidate_education_id = $1',
    modifyCandidatePublication: `update candidate_publication set candidate_id=$2, title = $3, published_year = $4, link = $5, updated_on = $6, updated_by = $7 where candidate_publication_id = $1`,
    insertCandidatePublication:'insert into candidate_publication (candidate_id, title, published_year, link, created_by, updated_by, created_on, updated_on) values ($1,$2,$3,$4,$5,$5,$6,$6)',
    deleteCandidatePublication:'update candidate_publication set status=false, updated_on = $2, updated_by = $3 where candidate_publication_id = $1',
    
    deleteCloud:'update candidate_cloud set status = false,updated_by=$3,updated_on=$4 where candidate_id=$1 and cloud_proficiency_id <> ALL ($2)',
    modifyCloud:'insert into candidate_cloud(candidate_id, cloud_proficiency_id, created_by, updated_by, created_on, updated_on) values ($1, unnest($2::int[]),$3, $3, $4, $4) on conflict on constraint candidate_id_cloud_proficiency_id_unique_key do update set status=true, updated_by=$3, updated_on=$4',
    modifySocial:'insert into candidate_social(candidate_id, github, github_link, linkedin, linkedin_link, stackoverflow, stackoverflow_link, kaggle, kaggle_link, created_by, updated_by, created_on, updated_on) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$10,$11,$11) on conflict(candidate_id) do update set github=$2, github_link=$3, linkedin=$4, linkedin_link=$5, stackoverflow=$6,stackoverflow_link=$7,kaggle=$8,kaggle_link=$9,updated_by=$10,updated_on=$11;',
    modifyCandidateAward: `update candidate_certifications set candidate_id=$2, certification_id = $3, certified_year = $4, updated_on = $5, updated_by = $6 where candidate_certification_id = $1`,
    insertCandidateAward:'insert into candidate_certifications(candidate_id,certification_id, certified_year,created_by, updated_by, created_on, updated_on) values ($1, $2, $3, $4, $4, $5,$5)',
    deleteCandidateAward:'update candidate_certifications set status=false, updated_on = $2, updated_by = $3 where candidate_certification_id = $1',

    modifyCandidateSkill: `update candidate_skill set skill_id = $skillid, preferred = $preferred, competency = $competency, years_of_experience = $yoe, skill_version = $skillversion, updated_on = $currenttime, updated_by = $employeeid where candidate_skill_id = $candidateskillid`,
    insertCandidateSkill:'insert into candidate_skill(candidate_id,skill_id, preferred, competency, years_of_experience, skill_version, created_on, updated_on,created_by,updated_by) values ($candidateid,$skillid,$preferred,$competency,$yoe,$skillversion,$currenttime,$currenttime,$employeeid,$employeeid)',
    deleteCandidateSkill:'delete from candidate_skill where candidate_skill_id=$1',
    modifyResumeFile:'update candidate set resume=$2,updated_on=$3,updated_by=$4 where candidate_id=$1',
    getAllProfileDetails:'select ca.candidate_first_name as "firstName", ca.candidate_last_name as "lastName", ca.cover_note as "description", ca.resume as "resume", ca.candidate_status as "candidateStatus", cp.ellow_rate as "ellowRate",ca.rate as "rate", ca.work_experience as "workExperience", ca.remote_work_experience as "remoteWorkExperience", ca.company_id as "sellerCompanyId", ca.image as "image", ca.citizenship as "citizenship", ca.residence as "residence", ca.phone_number as "phoneNumber", ca.email_address as "email", ca.billing_type as "billingTypeId", ca.currency_type_id as "currencyTypeId", ca.candidate_position_name as "candidatePositionName", ca.candidate_vetted as "candidateVetted", ca.availability as "availability", ca.type_of_availability as "typeOfAvailability", ca.ready_to_start as "readyToStart",ca.assessment_comment as "assessmentComment" from candidate ca left join candidate_position cp on cp.candidate_id=ca.candidate_id where ca.candidate_id = $1',
    fetchSkillDetails:'select candidate_skill_id as "candidateSkillId", candidate_id as "candidateId", preferred, competency, skill_version as "skillVersion", years_of_experience as "yoe", json_build_object(\'skillId\', s.skill_id, \'skillName\', s.skill_name) as skill from candidate_skill cs left join skills s on cs.skill_id = s.skill_id where candidate_id = $1 and cs.status = true group by cs.candidate_skill_id, s.skill_id, s.skill_name order by preferred desc nulls last,competency desc nulls last',
    fetchProjectDetails:'select candidate_project_id as "candidateProjectId", candidate_id as "candidateId", project_name as "projectName", company_name as "clientName", project_description as "projectDescription", project_link as "projectLink", skills, side_project as "extraProject",contribution as "contribution",done_for as "doneFor",role as "role" from candidate_project where candidate_id = $1 and status = true',
    fetchAssesmentDetails:'select candidate_assesment_id as "candidateAssesmentId", candidate_id as "candidateId", assesement_trait as "assesmentComment", assesment_rating as "rating", assesement_type as "assementType", is_link_available as "isLinkAvailable" from candidate_assesement where candidate_id = $1 and status = true',
    fetchWorkExperienceDetails:'select candidate_work_experience_id as "candidateWorkExperienceId", candidate_id as "candidateId", candidate_position_name as "positionName", candidate_company_name as "companyName", description, logo, still_working as "stillWorking", start_date as "startDate", end_date as "endDate" from candidate_work_experience where candidate_id = $1 and status = true order by start_date desc nulls last',
    fetchEducationDetails:'select candidate_education_id as "candidateEducationId", candidate_id as "candidateId", degree, college, start_date as "startDate", end_date as "endDate" from candidate_education where candidate_id = $1 and status = true order by start_date desc nulls last',
    fetchCloudProficiency:'select candidate_id as "candidateId", cc.cloud_proficiency_id as "cloudProficiencyId", cp.proficiency_name as "cloudProficiencyName" from candidate_cloud cc left join cloud_proficiency cp on cc.cloud_proficiency_id = cp.cloud_proficiency_id where cc.candidate_id = $1 and cc.status = true',
    fetchSocialProfile:'select candidate_id as "candidateId",github, github_link as "githubLink", linkedin, linkedin_link as "linkedinLink", stackoverflow,stackoverflow_link as "stackoverflowLink",kaggle, kaggle_link as "kaggleLink" from candidate_social where candidate_id = $1 and status=true',
    fetchPublicationDetails:'select candidate_publication_id as "candidatePublicationId", candidate_id as "candidateId", title, published_year as "publishedYear", link from candidate_publication where candidate_id = $1 and status = true order by published_year desc nulls last',
    fetchAwardDetails:'select candidate_certification_id as "candidateAwardId", candidate_id as "candidateId", certification_id as "certificationId", certified_year as "certifiedYear" from candidate_certifications where candidate_id = $1 and status = true order by certified_year desc nulls last',
    fetchLanguageDetails:'select candidate_language_id as "candidateLanguageId", candidate_id as "candidateId", language_id as "languageId", l.language as "languageName", proficiency from candidate_language cl join languages l on cl.language_id = l."languageId" where cl.candidate_id = $1 and cl.status = true  order by proficiency desc',
    addExperience:'update candidate set work_experience=$2, remote_work_experience=$3,rate=$4, billing_type=$5, currency_type_id=$6, updated_on=$7, updated_by=$8 where candidate_id = $1',
    
    codeTestStatusUpdate:'UPDATE candidate SET code_test_status=$2, updated_by = $3, updated_on = $4 WHERE candidate_id = $1',
    interviewTestStatusUpdate:'UPDATE candidate SET interview_test_status=$2, updated_by = $3, updated_on = $4 WHERE candidate_id = $1', 

    getStatus:'SELECT candidate_vetted as "candidateVetted",candidate_status as "candidateStatus",candidate_position_name as "candidatePositionName",availability as "availability" FROM candidate WHERE candidate_id=$1',
    // Queries related to resume sharing
    addResumeShare : 'insert into candidate_resume_share (candidate_id, unique_key,shared_emails, created_by, updated_by, created_on, updated_on) values ($1,$2,$3, $4, $4, $5,$5) on conflict (candidate_id) do update set shared_emails = $3 returning unique_key,shared_emails',
    getSharedEmails : 'select shared_emails as "sharedEmails" from candidate_resume_share where candidate_id=$1',
    fetchCandidateIdfromResumeId : 'select candidate_id,shared_emails from candidate_resume_share where unique_key like $1 and status=true',
    getDomainFromEmployeeId : 'select substring(email,\'[^@]+$\') as domain from employee where employee_id=$1',
    getEmployeeName:'SELECT firstname,lastname FROM employee WHERE employee_id=$1',
    getSharedEmailsWithTokens:'select shared_emails as "sharedEmails",updated_by as "updatedBy" from candidate_resume_share where unique_key like $1',
    getCompanyId:'SELECT company_id FROM employee WHERE employee_id=$1',
    insertUserDetails:'INSERT INTO employee (firstname,lastname,email,telephone_number,company_id,password,created_on,updated_on,status,account_type,user_role_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$7,$8,$9,$9)',
    checkEMail:'SELECT * from employee WHERE email like $1',
    getEmployeeEmailFromId:'SELECT email FROM employee WHERE employee_id=$1',
    getPositionName:'select position_name as "positionName" from positions where position_id=$1',
    getCandidateForAddFromListViews:'select distinct chsv."candidateId", chsv.availability, chsv."availabilityType", chsv."allocatedTo", chsv."ellowRate", chsv."email", chsv."phoneNumber", chsv."createdOn", chsv."updatedOn", chsv."resume", chsv."currencyTypeId", chsv."billingTypeId", chsv."companyId", chsv."companyName", chsv."candidateFirstName", chsv."candidateLastName", chsv."rate", chsv."candidateStatus", chsv."candidateVetted", chsv."stageStatusName", chsv."createdBy", chsv."residence", chsv."workExperience", (select array( (select jsonb_build_object(\'positionId\', chsv2."positionId", \'positionName\', chsv2."positionName", \'jobReceivedId\', chsv2."jobReceivedId", \'companyName\', chsv2."hirerCompanyName", \'assignedTo\', chsv2."assignedTo", \'makeOffer\', chsv2."makeOffer", \'positionStatusName\', chsv2."positionStatusName") from candidate_hiring_steps_view chsv2 where chsv2."candidateId" = chsv."candidateId" and chsv2."positionId" is not null)) as positions), chsv."skills", chsv.otherskills as "otherSkills" from candidate_hiring_steps_view chsv where chsv."candidateId" not in (select "candidateId" from candidate_hiring_steps_view where "positionId" = $positionid) and chsv."candidateStatus"=3 and chsv."availability"= true ',
    saveSharedEmailsForpdf : 'WITH oldvalues AS ( SELECT shared_emails FROM candidate_resume_share_pdf WHERE candidate_id = $candidateid ) insert into candidate_resume_share_pdf (candidate_id, created_by, updated_by, created_on, updated_on, shared_emails) values ($candidateid,$employeeid,$employeeid,$currenttime,$currenttime,$sharedemails) on conflict on constraint candidate_resume_share_pdf_candidate_id_unique_key do update set updated_by=$employeeid,updated_on=$currenttime,shared_emails=$sharedemails RETURNING (select shared_emails from oldvalues)',
    getSharedEmailsForpdf : 'select shared_emails as sharedEmails from candidate_resume_share_pdf where candidate_id=$1',
    updateCandidateAvailability:'update candidate set availability=$2,type_of_availability=1 where candidate_id=$1',
    getCandidateAssesmentDetails:'SELECT ca.candidate_assesment_id as "candidateAssessmentId", ca.assesement_name as "assesementName", ca.assesment_type as "assesmentType", ca.assessment_comment as "assessmentComment", ca.assessment_link as "assessmentLink", ca.assessment_link_text as "assessmentLinkText", ca.assesment_attachments as "attachments", ca.assessment_rating as "rating",(select e.firstname as "assignedTo" from employee e  where ca.assigned_to = e.employee_id ), ca.stage_name as "stageName", ca.stage_status as "stageStatus", ca.stage_start_date as "stageStartDate", ca.created_on as "createdOn", ca.updated_on as "updatedOn", ca.status as "status", ca.created_by as "createdBy", ca.updated_by as "updatedBy",ca.assignee_comment as "assigneeComment" FROM candidate_assesement ca WHERE ca.candidate_id = $1 order by ca.candidate_assesment_id',
    changeAssignee:'update candidate set allocated_to=$assigneeid, updated_on = $currenttime, updated_by=$employeeid where candidate_id=$candidateid',
    changeEllowRecruitmentStage:'update candidate set candidate_vetted=(select review_steps_id from review_steps where stage_name like $stagename),current_ellow_stage=(select review_steps_id from review_steps where stage_name like $stagename), updated_on=$currenttime, updated_by=$employeeid where candidate_id = $candidateid',
    ellowStageStatusUpdate : 'update candidate_assesement SET stage_status = case when candidate_assesment_id < $assessmentid and (stage_status is null or stage_status = 1) then -1 when candidate_assesment_id > $assessmentid and stage_status=1 then null when candidate_assesment_id = $assessmentid and stage_status is null then 1 else stage_status end, updated_on = case when candidate_assesment_id = $assessmentid then $currenttime else updated_on end, updated_by = case when candidate_assesment_id = $assessmentid then $employeeid else updated_by end where candidate_id = $candidateid',
    rejectFromCandidateEllowRecruitment:'WITH src AS (UPDATE candidate_assesement SET stage_status = 0, assigned_to =$assignedto, assessment_comment=$comment, assessment_rating=$rating, assessment_link=$link, assessment_link_text=$linktext, updated_on = $currenttime,updated_by=$employeeid WHERE candidate_assesment_id = $assessmentid returning candidate_id) UPDATE candidate c SET candidate_vetted = 0, updated_on = $currenttime, updated_by=$employeeid FROM src WHERE c.candidate_id = src.candidate_id',
    insertLogs:'INSERT INTO audit_log (audit_name,audit_type,audit_log_comment,created_on,created_by) VALUES ($1,$2,$3,$4,$5)',
    updateAssigneeComments:'update candidate_assesement set assignee_comment=$2,stage_start_date=$3 where candidate_assesment_id=$1',
    getCandidateVettedAllocatedTo:'select candidate_vetted,allocated_to,current_ellow_stage from candidate where candidate_id=$1',
    getellowAdmins:"select concat(firstname,' ',lastname) as name ,employee_id as employeeId from employee where status=true and user_role_id=1",
    getAuditLogs:'select audit_log_id as "auditLogId",audit_name as "auditName",audit_type as "auditType",audit_log_comment as "auditLogComment",created_on as "createdOn",created_by as "createdBy" from audit_log' 

}