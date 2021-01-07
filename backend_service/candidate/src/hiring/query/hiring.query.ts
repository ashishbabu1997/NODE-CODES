export default {
    getPositionHiringStepsQuery:'select position_hiring_step_id as "positionHiringStepId",hiring_step_name as "hiringStepName",hiring_step_type as "hiringStepType",position_id as "positionId",hiring_step_order as "hiringStepOrder",status as "status",created_by as "createdBy",updated_by as "updatedBy",created_on as "createdOn",updated_on as "updatedOn" from position_hiring_step where position_id=$1 order by hiring_step_order',
    candidateHiringStepsQuery:'select candidate_client_hiring_step_id as "candidateClientHiringStepId", candidate_hiring_step_name as "candidateHiringStepName", candidate_hiring_step_type as "candidateHiringStepType", candidate_hiring_step_order as "candidateHiringStepOrder", assigned_to as "assignedTo", assignee_comment as "assigneeComment", position_id as "positionId", candidate_hiring_step_comment as "candidateHiringStepComment", step_status as "stepStatus", attachments as "attachments", step_link as "stepLink", step_link_text as "stepLinkText", status as "status", created_by as "createdBy", updated_by as "updatedBy", created_on as "createdOn", updated_on as "updatedOn" from candidate_client_hiring_step where candidate_id = $1 and position_id=$2 and status=true;',
    candidateAllPositionsHiringStepsQuery:'select (select concat( ca.candidate_first_name,\' \',ca.candidate_last_name) from candidate ca where ca.candidate_id=cp.candidate_id ) as "candidateName",cp.position_id as "positionId", cp.candidate_id as "candidateId", cp.current_stage as "currentStage", cp.job_receievd_id as "jobReceivedId", cp.make_offer as "makeOffer", cp.assigned_to as "assignedTo", p.position_name as "positionName", p.company_id as "companyId", c.company_name as "companyName", c.company_logo as "companyLogo", (select array (select json_build_object(\'assigneeId\',e.employee_id,\'assigneeName\',concat( e.firstname ,\' \', e.lastname)) from employee e where e.company_id= p.company_id and e.status=true)) as assigneeList, (select array( select json_build_object(\'candidateClientHiringStepId\', cchs.candidate_client_hiring_step_id, \'candidateHiringStepName\', cchs.candidate_hiring_step_name, \'candidateHiringStepType\', cchs.candidate_hiring_step_type, \'candidateHiringStepOrder\', cchs.candidate_hiring_step_order, \'assignedTo\', cchs.assigned_to, \'candidateHiringStepComment\', cchs.candidate_hiring_step_comment, \'stepLinkText\', cchs.step_link_text, \'stepLink\', cchs.step_link, \'attachments\', cchs.attachments, \'stepStatus\', cchs.step_status, \'assigneeComment\', cchs.assignee_comment, \'stepStartDate\', cchs.step_start_date, \'updatedOn\', cchs.updated_on, \'updatedBy\', cchs.updated_by ) from candidate_client_hiring_step cchs where cchs.position_id = cp.position_id and cchs.candidate_id = cp.candidate_id)) as "hiringSteps" from candidate_position cp left join positions p on p.position_id = cp.position_id left join company c on p.company_id = c.company_id where candidate_id = $1 and p.status = true order by p.position_id',
    getDefaultHiringStepsQuery:'select step_name as "hiringStepName",step_type as "hiringStepType",hiring_order as "hiringStepOrder"  from default_client_hiring_step where status=true order by hiring_order',
    addCandidatePositionHiringSteps:'insert into candidate_client_hiring_step(candidate_hiring_step_name, candidate_hiring_step_type, candidate_hiring_step_order, candidate_id, position_id, created_by, updated_by, created_on, updated_on) values (unnest(array( select phs.hiring_step_name from position_hiring_step phs where phs.position_id = $1 and phs.status = true)), unnest(array(select phs.hiring_step_type from position_hiring_step phs where phs.position_id = $1 and phs.status = true)), unnest(array(select phs.hiring_step_order from position_hiring_step phs where phs.position_id = $1 and phs.status = true)), $2, $1, $3, $3, $4, $4)',
    updateHiringStepDetails:'update candidate_client_hiring_step set assigned_to=$assignedTo, candidate_hiring_step_comment=$candidateHiringStepComment, step_status=2, attachments=$attachments, step_link=$stepLink, step_link_text=$stepLinkText, updated_on=$currenttime, updated_by=$employeeid where candidate_client_hiring_step_id=$candidateClientHiringStepId',
    moveCandidateHiringStep:'update candidate_client_hiring_step SET step_status = case when candidate_hiring_step_order < $candidateHiringStepOrder and (step_status is null or step_status = 1) then -1 when candidate_hiring_step_order > $candidateHiringStepOrder and step_status=1 then null when candidate_hiring_step_order = $candidateHiringStepOrder and step_status is null then 1 else step_status end, updated_on = case when candidate_client_hiring_step_id = $candidateClientHiringStepId then $currenttime else updated_on end, updated_by = case when candidate_client_hiring_step_id = $candidateClientHiringStepId then $employeeid else updated_by end where candidate_id = $candidateid and position_id=$positionid',
    updateCurrentStage:'update candidate_position set current_stage=$hiringstepname, updated_by=$employeeid, updated_on=$currenttime where candidate_id = $candidateid and position_id = $positionid',
    rejectFromHiringProcess:'WITH src AS (UPDATE candidate_client_hiring_step SET step_status = 0, assigned_to=$assignedto, candidate_hiring_step_comment=$comment,attachments=$attachments, step_link=$link, step_link_text=$linktext WHERE candidate_client_hiring_step_id = $id) UPDATE candidate_position cp SET make_offer = 0, current_stage = \'Rejected\', updated_on = $currenttime, updated_by=$employeeid FROM src WHERE cp.candidate_id = $candidateid and cp.position_id=$positionid',
    addNewStageForCandidate:'insert into candidate_client_hiring_step (candidate_hiring_step_name, candidate_hiring_step_type, candidate_hiring_step_order, candidate_id, position_id, created_by, updated_by, created_on, updated_on) values ($stepname, $steptype, (select max(candidate_hiring_step_order) from candidate_client_hiring_step where candidate_id = $candidateid and position_id = $positionid and status = true)+1, $candidateid,$positionid,$employeeid,$employeeid,$currenttime,$currenttime )',
    updateDefaultAssignee:'update candidate_position set assigned_to=$assignedto, updated_by=$employeeid, updated_on=$currenttime where candidate_id = $candidateid and position_id = $positionid',
    candidateCurrentStage:'select current_stage as "currentStage", assigned_to as "assignedTo" from candidate_position where candidate_id = $1 and position_id = $2',
    getPositionNameFromId:'select position_name as "positionName" from positions where position_id=$1',
    getCompanyNameFromId:'select company_name as "companyName" from company where company_id=$1',
    insertClientHiringStep:'insert into candidate_client_hiring_step(candidate_hiring_step_name,candidate_id,position_id,assigned_to,status,step_start_date) values ($1,$2,$3,$4,$5,$6)',
    deletePositionHiringStep : 'delete from position_hiring_step where position_hiring_step_id=$1;'
}