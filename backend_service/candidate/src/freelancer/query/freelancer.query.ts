export default {
  modifySocialProfileAndStatusUpdate: 'insert into candidate_social(candidate_id, github, github_link, linkedin, linkedin_link, stackoverflow, stackoverflow_link,status, created_by, updated_by, created_on, updated_on) values($1,$2,$3,$4,$5,$6,$7,true,$8,$8,$9,$9) on conflict(candidate_id) do update set github=$2, github_link=$3, linkedin=$4, linkedin_link=$5, stackoverflow=$6,stackoverflow_link=$7,status=true,updated_by=$8,updated_on=$9;',
  addDefaultAssessmentTraits: 'insert into candidate_assesement (candidate_id, assesement_name, assesment_type, stage_name, created_on, updated_on, created_by, updated_by, stage_start_date) values ($candidateid, unnest(array(select r.assessment_name from review_steps r where status = true)), unnest(array(select r.review_type from review_steps r where status = true)), unnest(array(select r.stage_name from review_steps r where status = true)), $currenttime,$currenttime,$employeeid,$employeeid,$currenttime)',
  listDraftFreelancersTotalCount: 'select count(distinct chsv."candidateId") as "totalCount" from candidate_hiring_steps_view chsv left join company c on c.company_id=chsv."companyId" where c.company_type=2 and chsv."candidateStatus"=4   ',
  listDraftFreelancersFromView: 'select distinct on ("candidateId","candidateFirstName","candidateLastName","companyName","updatedOn",availability,"createdOn","workExperience",email) chsv."candidateId", chsv.availability, chsv."readyToStart", chsv."updatedOn", chsv."availabilityType", chsv."allocatedTo", chsv."candidatePositionName", chsv."remoteWorkExperience", chsv."ellowRate", chsv."email", chsv."phoneNumber", chsv."createdOn", chsv."resume", chsv."currencyTypeId", chsv."billingTypeId", chsv."companyId", chsv."companyName", chsv."candidateFirstName", chsv."candidateLastName", chsv."rate", chsv."candidateStatus", chsv."candidateVetted", chsv."stageStatusName", chsv."createdBy", chsv."residence", chsv."image", chsv."workExperience", chsv."remoteWorkExperience", chsv."candidatePositionName", (select (select json_agg(position) as positions from ( (select "positionId", "positionName",  "hirerCompanyName" as "companyName", "assignedTo", "makeOffer", "positionStatusName" from candidate_hiring_steps_view chsv2 where chsv2."candidateId" = chsv."candidateId" and chsv2."positionId" is not null )) as position)), chsv."skills", chsv.otherskills as "otherSkills" from candidate_hiring_steps_view chsv left join company c on c.company_id=chsv."companyId" where c.company_type=2 and chsv."candidateStatus"=4 ',
  listFreelancerJobs: 'select p.position_id, position_name, developer_count, job_description, experience_level, jc.job_category_id,jc.job_category_name, array_agg (skill_name) as skills from positions p left join job_category jc on jc.job_category_id = p.job_category_id left join job_skills js on p.position_id = js.position_id and js.top_rated_skill=true and js.status=true left join skills s on js.skill_id = s.skill_id where p.status = true and p.job_status = 6 and p.position_name ilike $search group by p.position_id,jc.job_category_id ',
  getellowAdmins: 'select concat(firstname,\' \',lastname) as name ,employee_id as employeeId from employee where status=true and user_role_id=1',
  getFreelancerCompanyId: 'select company_id from company where company_type=2',
  insertRequestToken: 'update candidate_position set request_token=$1 where candidate_id=$2 and position_id=$3',
  updateRequestForScreening: 'update candidate set request_for_screening=true where candidate_id=$1',
  getCandidateSkills: 'select json_agg(json_build_object(\'skillName\',s.skill_name)) as skills from skills s left join candidate_skill cs on cs.skill_id=s.skill_id where cs.candidate_id =$1 and cs.preferred=true',
  updateCandidateStatus: 'UPDATE candidate SET candidate_status=$4,updated_by=$2,updated_on=$3,created_on=$3 WHERE candidate_id=$1 returning candidate_first_name,candidate_last_name',
  getPositionsDetails: 'select p.position_id, p.position_name, p.developer_count, p.job_description, p.experience_level, jc.job_category_id,jc.job_category_name,cp.current_stage,cp.make_offer,c.company_name, array_agg (skill_name) as skills from positions p left join candidate_position cp on cp.position_id=p.position_id left join company c on c.company_id=p.company_id left join job_category jc on jc.job_category_id = p.job_category_id left join job_skills js on p.position_id = js.position_id and js.top_rated_skill=true and js.status=true left join skills s on js.skill_id = s.skill_id where cp.candidate_id=$1 and p.status = true and p.job_status = 6 group by p.position_id,jc.job_category_id,cp.candidate_position_id,c.company_id',
  getCandidateMailDetails: 'select image,candidate_first_name,candidate_last_name,email_address,candidate_position_name,phone_number from candidate where candidate_id=$1',
  getLinkToPositionEmailDetails: 'select initcap(candidate_first_name || candidate_last_name) as name,candidate_last_name,candidate_first_name , email_address, ready_to_start,work_experience, image, (select max(years_of_experience) from candidate_skill cs left join job_skills j on j.skill_id = cs.skill_id where candidate_id = $1 and position_id = $2 and j.top_rated_skill = true) as "relevantExperience" from candidate where candidate_id = $1 ',
};
