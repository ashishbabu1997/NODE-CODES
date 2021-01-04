export default {
    getPositionHiringStepsQuery:'select position_hiring_step_id as "positionHiringStepId",hiring_step_name as "hiringStepName",hiring_step_type as "hiringStepType",position_id as "positionId",hiring_step_order as "hiringStepOrder",status as "status",created_by as "createdBy",updated_by as "updatedBy",created_on as "createdOn",updated_on as "updatedOn" from position_hiring_step where position_id=$1',
    candidateHiringStepsQuery:'select candidate_client_hiring_step_id as "candidateClientHiringStepId", candidate_hiring_step_name as "candidateHiringStepName", candidate_hiring_step_type as "candidateHiringStepType", candidate_hiring_step_order as "candidateHiringStepOrder", assigned_to as "assignedTo", assignee_comment as "assigneeComment", position_id as "positionId", candidate_hiring_step_comment as "candidateHiringStepComment", step_status as "stepStatus", attachments as "attachments", step_link as "stepLink", step_link_text as "stepLinkText", status as "status", created_by as "createdBy", updated_by as "updatedBy", created_on as "createdOn", updated_on as "updatedOn" from candidate_client_hiring_step where candidate_id = $1 and position_id=$2 and status=true;',
    getDefaultHiringStepsQuery:'select step_name as "hiringStepName",step_type as "hiringStepType",hiring_order as "hiringStepOrder"  from default_client_hiring_step where status=true order by hiring_order',
    addCandidatePositionHiringSteps:'insert into candidate_client_hiring_step(candidate_hiring_step_name, candidate_hiring_step_type, candidate_hiring_step_order, candidate_id, position_id, created_by, updated_by, created_on, updated_on) values (unnest(array( select phs.hiring_step_name from position_hiring_step phs where phs.position_id = $1 and phs.status = true)), unnest(array(select phs.hiring_step_type from position_hiring_step phs where phs.position_id = $1 and phs.status = true)), unnest(array(select phs.hiring_step_order from position_hiring_step phs where phs.position_id = $1 and phs.status = true)), $2, $1, $3, $3, $4, $4)',
    updateHiringStepDetails:'update candidate_client_hiring_step set assigned_to=$assignedTo, candidate_hiring_step_comment=$candidateHiringStepComment, step_status=2, attachments=$attachments, step_link=$stepLink, step_link_text=$stepLinkText, updated_on=$currenttime, updated_by=$employeeid where candidate_client_hiring_step_id=$candidateClientHiringStepId',
    moveCandidateHiringStep:'update candidate_client_hiring_step SET step_status = case when candidate_hiring_step_order < $candidateHiringStepOrder and (step_status is null or step_status = 1) then -1 when candidate_hiring_step_order > $candidateHiringStepOrder and step_status=1 then null when candidate_hiring_step_order = $candidateHiringStepOrder and step_status is null then 1 else step_status end, updated_on = case when candidate_client_hiring_step_id = $candidateClientHiringStepId then $currenttime else updated_on end, updated_by = case when candidate_client_hiring_step_id = $candidateClientHiringStepId then $employeeid else updated_by end where candidate_id = $candidateid and position_id=$positionid',
    updateCurrentStage:'update candidate_position set current_stage=$hiringstepname, updated_by=$employeeid, updated_on=$currenttime where candidate_id = $candidateid and position_id = $positionid',
    rejectFromHiringProcess:'WITH src AS (UPDATE candidate_client_hiring_step SET step_status = 0, assigned_to=$assignedto, candidate_hiring_step_comment=$comment,attachments=$attachments, step_link=$link, step_link_text=$linktext WHERE candidate_client_hiring_step_id = $id) UPDATE candidate_position cp SET make_offer = 0, current_stage = \'Rejected\', updated_on = $currenttime, updated_by=$employeeid FROM src WHERE cp.candidate_id = $candidateid and cp.position_id=$positionid',
    addNewStageForCandidate:'insert into candidate_client_hiring_step (candidate_hiring_step_name, candidate_hiring_step_type, candidate_hiring_step_order, candidate_id, position_id, created_by, updated_by, created_on, updated_on) values ($stepname, $steptype, (select max(candidate_hiring_step_order) from candidate_client_hiring_step where candidate_id = $candidateid and position_id = $positionid and status = true)+1, $candidateid,$positionid,$employeeid,$employeeid,$currenttime,$currenttime )',
    updateDefaultAssignee:'update candidate_position set assigned_to=$assignedto, updated_by=$employeeid, updated_on=$currenttime where candidate_id = $candidateid and position_id = $positionid',
    candidateCurrentStage:'select current_stage as "currentStage", assigned_to as "assignedTo" from candidate_position where candidate_id = $1 and position_id = $2'
}