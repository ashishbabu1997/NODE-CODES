/* prettier-ignore */

export default {
  getPositionHiringStepsQuery: 'select position_hiring_step_id as "positionHiringStepId",hiring_step_name as "hiringStepName",hiring_step_type as "hiringStepType",position_id as "positionId",hiring_step_order as "hiringStepOrder",status as "status",created_by as "createdBy",updated_by as "updatedBy",created_on as "createdOn",updated_on as "updatedOn",hiring_assesment_name as "hiringAssesmentName",hiring_assesment_type as "hiringAssesmentType","default" from position_hiring_step where position_id=$1 order by hiring_step_order',
  candidateHiringStepsQuery: 'select candidate_client_hiring_step_id as "candidateClientHiringStepId", candidate_hiring_step_name as "candidateHiringStepName", candidate_hiring_step_type as "candidateHiringStepType", candidate_hiring_step_order as "candidateHiringStepOrder", assigned_to as "assignedTo", (select firstname from employee where employee_id = assigned_to) as "assigneeName", assignee_comment as "assigneeComment", position_id as "positionId", candidate_hiring_step_comment as "candidateHiringStepComment", step_status as "stepStatus", attachments as "attachments", step_link as "stepLink", step_link_text as "stepLinkText", step_start_date as "stepStartDate", status as "status", created_by as "createdBy", updated_by as "updatedBy", created_on as "createdOn", updated_on as "updatedOn", hiring_assesment_name as "hiringAssesmentName", hiring_assesment_type as "hiringAssesmentType", hiring_assesment_value as "hiringAssesmentValue" from candidate_client_hiring_step where candidate_id = $1 and position_id = $2 and status = true order by candidate_hiring_step_order ',
  // candidateAllPositionsHiringStepsQuery: 'select p.position_name as "positionName",array_agg (skill_name) as skills,p.description as "jobDescription",ccd.contract_start_date as "startDate",ccd.contract_end_date as "endDate", ( select concat(ca.candidate_first_name, \' \',ca.candidate_last_name) from candidate ca where ca.candidate_id = cp.candidate_id) as "candidateName", cp.position_id as "positionId", cp.candidate_id as "candidateId", cp.current_stage as "currentStage", cp.make_offer as "makeOffer", cp.assigned_to as "assignedTo", p.company_id as "companyId", c.company_name as "companyName", c.company_logo as "companyLogo", (select array( select json_build_object(\'assigneeId\',e.employee_id,\'assigneeName\',concat( e.firstname ,\' \', e.lastname)) from employee e where e.company_id = p.company_id and e.status = true)) as assigneeList, (select array( select json_build_object(\'candidateClientHiringStepId\', cchs.candidate_client_hiring_step_id, \'candidateHiringStepName\', cchs.candidate_hiring_step_name, \'candidateHiringStepType\', cchs.candidate_hiring_step_type, \'candidateHiringStepOrder\', cchs.candidate_hiring_step_order, \'assignedTo\', cchs.assigned_to, \'assigneeName\', (select firstname from employee where employee_id = cchs.assigned_to), \'candidateHiringStepComment\', cchs.candidate_hiring_step_comment, \'stepLinkText\', cchs.step_link_text, \'stepLink\', cchs.step_link, \'attachments\', cchs.attachments, \'stepStatus\', cchs.step_status, \'assigneeComment\', cchs.assignee_comment, \'stepStartDate\', cchs.step_start_date, \'updatedOn\', cchs.updated_on, \'updatedBy\', cchs.updated_by,\'hiringAssesmentName\', cchs.hiring_assesment_name ,\'hiringAssesmentType\',cchs.hiring_assesment_type,\'hiringAssesmentValue\',cchs.hiring_assesment_value) from candidate_client_hiring_step cchs where cchs.position_id = cp.position_id and cchs.candidate_id = cp.candidate_id order by cchs.candidate_hiring_step_order)) as "hiringSteps" from candidate_position cp left join positions p on p.position_id = cp.position_id left join company c on p.company_id = c.company_id left join candidate_contract_details ccd on (ccd.candidate_id = cp.candidate_id and ccd.position_id=cp.position_id) where cp.candidate_id = $1 and p.status = true ORDER BY CASE WHEN make_offer = 0 THEN 1 WHEN make_offer is null THEN 2 WHEN make_offer = 1 THEN 3 WHEN make_offer = 2 THEN 4 WHEN make_offer = -1 THEN 5 END, cp.created_on desc ',
  candidateAllPositionsHiringStepsQuery:'select p.position_name as "positionName", p.job_description as "jobDescription", array(select s.skill_name from skills s left join job_skills js on s.skill_id = js.skill_id where cp.position_id = js.position_id and js.top_rated_skill = true and js.status = true) as "skills", p.job_description as "jobDescription", ccd.contract_start_date as "startDate", ccd.contract_end_date as "endDate", (select concat(ca.candidate_first_name, \' \', ca.candidate_last_name) from candidate ca where ca.candidate_id = cp.candidate_id) as "candidateName", cp.position_id as "positionId", cp.candidate_id as "candidateId", cp.current_stage as "currentStage", json_build_object(\'amount\', cp.ellow_rate, \'currencyTypeId\', cp.currency_type_id, \'billingTypeId\', cp.billing_type) as "ellowRate", json_build_object(\'amount\', ccd.contract_rate, \'currencyTypeId\', ccd.currency_type_id, \'billingTypeId\', ccd.billing_type) as "contractRate", cp.make_offer as "makeOffer", cp.assigned_to as "assignedTo", p.company_id as "companyId", c.company_name as "companyName", c.company_logo as "companyLogo", (select array(select json_build_object(\'assigneeId\', e.employee_id, \'assigneeName\', concat(e.firstname, \' \', e.lastname)) from employee e where e.company_id = p.company_id and e.status = true)) as assigneeList, (select array(select json_build_object(\'candidateClientHiringStepId\', cchs.candidate_client_hiring_step_id, \'candidateHiringStepName\', cchs.candidate_hiring_step_name, \'candidateHiringStepType\', cchs.candidate_hiring_step_type, \'candidateHiringStepOrder\', cchs.candidate_hiring_step_order, \'assignedTo\', cchs.assigned_to, \'assigneeName\', (select firstname from employee where employee_id = cchs.assigned_to), \'candidateHiringStepComment\', cchs.candidate_hiring_step_comment, \'stepLinkText\', cchs.step_link_text, \'stepLink\', cchs.step_link, \'attachments\', cchs.attachments, \'stepStatus\', cchs.step_status, \'assigneeComment\', cchs.assignee_comment, \'stepStartDate\', cchs.step_start_date, \'updatedOn\', cchs.updated_on, \'updatedBy\', cchs.updated_by, \'hiringAssesmentName\', cchs.hiring_assesment_name, \'hiringAssesmentType\', cchs.hiring_assesment_type, \'hiringAssesmentValue\', cchs.hiring_assesment_value) from candidate_client_hiring_step cchs where cchs.position_id = cp.position_id and cchs.candidate_id = cp.candidate_id order by cchs.candidate_hiring_step_order)) as "hiringSteps",ccd.closed_by as "closedby",(select json_agg(json_build_object(\'amount\',ccd.contract_rate,\'currencyTypeId\',ccd.currency_type_id,\'billingTypeId\',ccd.billing_type,\'startDate\',ccd.contract_start_date,\'endDate\',ccd.contract_end_date)) from candidate_contract_details ccd where ccd.candidate_id=cp.candidate_id and ccd.position_id=cp.position_id) as "contractHistory" from candidate_position cp left join positions p on p.position_id = cp.position_id left join company c on p.company_id = c.company_id left join candidate_contract_details ccd on (ccd.candidate_id = cp.candidate_id and ccd.position_id = cp.position_id) where cp.candidate_id = $1 and p.status = true ORDER BY CASE WHEN make_offer = 0 THEN 1 WHEN make_offer is null THEN 2 WHEN make_offer = 1 THEN 3 WHEN make_offer = 2 THEN 4 WHEN make_offer = -1 THEN 5 END, cp.created_on desc ',
  candidateAllPositionsHiringStepsOfHirerQuery: 'select p.position_name as "positionName", ( select concat(ca.candidate_first_name, \' \',ca.candidate_last_name) from candidate ca where ca.candidate_id = cp.candidate_id) as "candidateName", cp.position_id as "positionId", cp.candidate_id as "candidateId", cp.current_stage as "currentStage", cp.make_offer as "makeOffer", cp.assigned_to as "assignedTo", p.company_id as "companyId", c.company_name as "companyName", c.company_logo as "companyLogo", (select array( select json_build_object(\'assigneeId\',e.employee_id,\'assigneeName\',concat( e.firstname ,\' \', e.lastname)) from employee e where e.company_id = p.company_id and e.status = true)) as assigneeList, (select array( select json_build_object(\'candidateClientHiringStepId\', cchs.candidate_client_hiring_step_id, \'candidateHiringStepName\', cchs.candidate_hiring_step_name, \'candidateHiringStepType\', cchs.candidate_hiring_step_type, \'candidateHiringStepOrder\', cchs.candidate_hiring_step_order, \'assignedTo\', cchs.assigned_to, \'assigneeName\', (select firstname from employee where employee_id = cchs.assigned_to), \'candidateHiringStepComment\', cchs.candidate_hiring_step_comment, \'stepLinkText\', cchs.step_link_text, \'stepLink\', cchs.step_link, \'attachments\', cchs.attachments, \'stepStatus\', cchs.step_status, \'assigneeComment\', cchs.assignee_comment, \'stepStartDate\', cchs.step_start_date, \'updatedOn\', cchs.updated_on, \'updatedBy\', cchs.updated_by,\'hiringAssesmentName\', cchs.hiring_assesment_name ,\'hiringAssesmentType\',cchs.hiring_assesment_type,\'hiringAssesmentValue\',cchs.hiring_assesment_value) from candidate_client_hiring_step cchs where cchs.position_id = cp.position_id and cchs.candidate_id = cp.candidate_id order by cchs.candidate_hiring_step_order)) as "hiringSteps" from candidate_position cp left join positions p on p.position_id = cp.position_id left join company c on p.company_id = c.company_id where p.company_id=$2 and candidate_id = $1 and p.status = true ORDER BY CASE WHEN make_offer = 0 THEN 1 WHEN make_offer is null THEN 2 WHEN make_offer = 1 THEN 3 WHEN make_offer = 2 THEN 4 WHEN make_offer = -1 THEN 5 END, cp.created_on desc ',
  getDefaultHiringStepsQuery: 'select step_name as "hiringStepName",step_type as "hiringStepType",hiring_order as "hiringStepOrder",hiring_assesment_name as "hiringAssesmentName",hiring_assesment_type as "hiringAssesmentType",true as default  from default_client_hiring_step where status=true order by hiring_order',
  addCandidatePositionHiringSteps: 'insert into candidate_client_hiring_step(candidate_hiring_step_name, candidate_hiring_step_type, candidate_hiring_step_order, candidate_id, position_id, created_by, updated_by, created_on, updated_on,hiring_assesment_name,hiring_assesment_type) values (unnest(array( select phs.hiring_step_name from position_hiring_step phs where phs.position_id = $1 and phs.status = true)), unnest(array(select phs.hiring_step_type from position_hiring_step phs where phs.position_id = $1 and phs.status = true)), unnest(array(select phs.hiring_step_order from position_hiring_step phs where phs.position_id = $1 and phs.status = true)), $2, $1, $3, $3, $4, $4,(unnest(array( select phs.hiring_assesment_name from position_hiring_step phs where phs.position_id = $1 and phs.status = true))),(unnest(array( select phs.hiring_assesment_type from position_hiring_step phs where phs.position_id = $1 and phs.status = true))))',
  updateHiringStepDetails: 'update candidate_client_hiring_step set assigned_to=$assignedTo, candidate_hiring_step_comment=$candidateHiringStepComment, step_status=2, attachments=$attachments, step_link=$stepLink, step_link_text=$stepLinkText, updated_on=$currenttime, updated_by=$employeeid,hiring_assesment_value=$hiringAssesmentValue where candidate_client_hiring_step_id=$candidateClientHiringStepId returning candidate_id,position_id,candidate_hiring_step_name',
  moveCandidateHiringStep: 'update candidate_client_hiring_step SET assigned_to=$assignedto,step_status = case when candidate_hiring_step_order < $candidateHiringStepOrder and (step_status is null or step_status = 1) then -1 when candidate_hiring_step_order > $candidateHiringStepOrder and step_status=1 then null when candidate_hiring_step_order = $candidateHiringStepOrder and step_status is null then 1 else step_status end, updated_on = case when candidate_client_hiring_step_id = $candidateClientHiringStepId then $currenttime else updated_on end, updated_by = case when candidate_client_hiring_step_id = $candidateClientHiringStepId then $employeeid else updated_by end where candidate_id = $candidateid and position_id=$positionid',
  updateCandidateHiringStep: 'update candidate_client_hiring_step set assigned_to=$1,step_status = 1,assignee_comment=$2,updated_on=$3,updated_by=$4,status=true where candidate_id = $5 and position_id=$6 and candidate_hiring_step_name=\'Discussion with resource\'',
  updateCurrentStage: 'update candidate_position set current_stage=$hiringstepname, updated_by=$employeeid, updated_on=$currenttime where candidate_id = $candidateid and position_id = $positionid',
  rejectFromHiringProcess: 'WITH src AS (UPDATE candidate_client_hiring_step SET step_status = 0, assigned_to =$assignedto, candidate_hiring_step_comment=$comment, attachments=$attachments, step_link=$link, step_link_text=$linktext WHERE candidate_client_hiring_step_id = $id returning candidate_id) UPDATE candidate_position cp SET make_offer = -1, current_stage = \'Rejected\', updated_on = $currenttime, updated_by=$employeeid FROM src WHERE cp.candidate_id = $candidateid and cp.position_id=$positionid',
  rejectFromHiring: 'WITH src AS (UPDATE candidate_client_hiring_step SET step_status = 0, assigned_to =$assignedto WHERE candidate_id=$candidateid and position_id=$positionid and candidate_hiring_step_name= \'Discussion with resource\' returning candidate_id) UPDATE candidate_position cp SET make_offer = -1, current_stage = \'Rejected\', updated_on = $currenttime, updated_by=$employeeid,hirer_comment=$comment FROM src WHERE cp.candidate_id = $candidateid and cp.position_id=$positionid',
  addNewStageForCandidate: 'insert into candidate_client_hiring_step (candidate_hiring_step_name, candidate_hiring_step_type, candidate_hiring_step_order, candidate_id, position_id, created_by, updated_by, created_on, updated_on) values ($stepname, $steptype, (select max(candidate_hiring_step_order) from candidate_client_hiring_step where candidate_id = $candidateid and position_id = $positionid and status = true)+1, $candidateid,$positionid,$employeeid,$employeeid,$currenttime,$currenttime )',
  updateDefaultAssignee: 'update candidate_position set assigned_to=$assignedto, updated_by=$employeeid, updated_on=$currenttime where candidate_id = $candidateid and position_id = $positionid',
  candidatePositionDetails: 'select cp.current_stage as "currentStage", cp.assigned_to as "assignedTo", cp.make_offer as "makeOffer", cp.ellow_rate as "ellowRate", cp.currency_type_id as "currencyTypeId", cp.billing_type as "billingTypeId", ccd.contract_end_date as "contractEndDate", ccd.contract_start_date as "contractStartDate", ccd.contract_rate as "contractRate" from candidate_position cp left join candidate_contract_details ccd on ccd.candidate_id = cp.candidate_id where cp.candidate_id = $1 and cp.position_id = $2',
  getPositionNameFromId: 'select p.position_name,e.email,e.employee_id,c.company_name from positions p left join employee e on e.employee_id=p.allocated_to left join company c on c.company_id=p.company_id where p.position_id=$1',
  getHirerAssigneeDetailsQuery: 'select e.employee_id,initcap(e.firstname ||  \' \' || e.lastname) as name from employee e left join company c on e.company_id = c.company_id  left join positions p on p.company_id=c.company_id where p.position_id=$1 and e.primary_email=true',
  getCompanyNameFromId: 'select company_name as "companyName" from company where company_id=$1',
  fetchResourceCounts: 'select developer_count,close_count from positions where position_id=$1',
  closeJobStatus: 'update positions set job_status=8 where position_id=$1',
  setContractFalse:'update candidate_contract_details set in_contract=false where candidate_id=$1',
  insertContractDetails:'insert into candidate_contract_details (candidate_id, position_id, contract_start_date, contract_end_date, created_on, updated_on, created_by, updated_by, in_contract, contract_rate, currency_type_id, billing_type,closed_by) values ($1, $2, $3, $4, $5, $5, $6, $6, $7, $8, $9, $10,$11)',
  updateResourceCount: 'update positions set close_count=close_count+1 where position_id=$1 returning developer_count,close_count',
  getJoinedCompanyName: 'select c.company_name as "companyName" from company c inner join employee e on e.company_id=c.company_id where e.employee_id=$1',
  updateAssigneeComments: 'update candidate_client_hiring_step set step_start_date=$3, assignee_comment=$2 where candidate_client_hiring_step_id = $1',
  deletePositionHiringStep: 'delete from position_hiring_step where position_hiring_step_id=$1;',
  updateCandidateHiringStepOrder: 'update candidate_client_hiring_step set candidate_hiring_step_order=$2,updated_on=$3 where candidate_client_hiring_step_id=$1 ',
  updateMakeOffer: 'update candidate_position set make_offer=$makeOffer,updated_on=$updatedOn,updated_by=$updatedBy where candidate_id=$candidateId and position_id=$positionId',
  updateCandidateAvailability: 'update candidate set availability=$2 where candidate_id=$1',
  getCandidateNames: 'select candidate_first_name as "firstName",candidate_last_name s "lastName" from candidate where candidate_id=$1',
  setOldContractToFalse:'update candidate_contract_details set in_contract=false where candidate_id=$1 and position_id=$2',

};
