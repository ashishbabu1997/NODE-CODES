export default {
    hirerPositionCounts:'with counts as ( select (select sum(developer_count) as "totalCount" from positions where status = true and job_status in (6, 8) and company_id = $1), (select count(*) as "closedCount" from candidate_hiring_steps_view where "pStatus" = true and "caStatus" = true and "positionStatusName" ilike \'Resource accepted offer\' and "hirerCompanyId" = $1 ) ) select * from counts',
    adminPositionCounts : 'with counts as ( select (select sum(developer_count) as "totalCount" from positions where status = true and job_status in (6, 8)), (select count(*) as "closedCount" from candidate_hiring_steps_view where "pStatus" = true and "caStatus" = true and "positionStatusName" ilike \'Resource accepted offer\') ) select * from counts',
    clientHiringCountsHirer: 'with stages as (SELECT case when "positionStatusName" is null then \'Submitted to hirer\' else REPLACE(REPLACE("positionStatusName", \'Scheduled\', \'\'), \'Completed\', \'\') end as "stageName" FROM candidate_hiring_steps_view where "pStatus" = true and "hirerCompanyId"=$1) select "stageName", count(*) from stages s where "stageName" in (\'Submitted to hirer\', \'Discussion with resource \', \'Make offer\', \'Negotiation/Close position\', \'Resource accepted offer\') group by s."stageName" order by case when "stageName" ilike \'Submitted to hirer\' then 1 when "stageName" ilike \'Discussion with resource \' then 2 when "stageName" ilike \'Make offer\' then 3 when "stageName" ilike \'Negotiation/Close position\' then 4 when "stageName" ilike \'Resource accepted offer\' then 5 end',
    clientHiringCountsAdmin : 'with stages as (SELECT case when "positionStatusName" is null then \'Submitted to hirer\' else REPLACE(REPLACE("positionStatusName", \'Scheduled\', \'\'), \'Completed\', \'\') end as "stageName" FROM candidate_hiring_steps_view where "pStatus" = true) select "stageName", count(*) from stages s where "stageName" in (\'Submitted to hirer\', \'Discussion with resource \', \'Make offer\', \'Negotiation/Close position\', \'Resource accepted offer\') group by s."stageName" order by case when "stageName" ilike \'Submitted to hirer\' then 1 when "stageName" ilike \'Discussion with resource \' then 2 when "stageName" ilike \'Make offer\' then 3 when "stageName" ilike \'Negotiation/Close position\' then 4 when "stageName" ilike \'Resource accepted offer\' then 5 end',
    clientHiringSideCountHirer : 'with src as ( select (select COUNT(*) from candidate_hiring_steps_view where "positionStatusName" ilike (\'Resource accepted offer\') and "pStatus" = true and "hirerCompanyId" = $1 ) "resourceAcceptedCount", (select COUNT(*) from candidate_hiring_steps_view where "positionStatusName" ilike (\'Resource rejected offer\') and "pStatus" = true and "hirerCompanyId" = $1 ) "resourceRejectedCount", (select COUNT(*) from candidate_hiring_steps_view where "positionStatusName" ilike (\'Ellow rejected offer\') and "pStatus" = true and "hirerCompanyId" = $1 ) "ellowRejectedCount" ) select * from src',
    clientHiringSideCountAdmin:'with src as ( select (select COUNT(*) from candidate_hiring_steps_view where "positionStatusName" ilike (\'Resource accepted offer\') and "pStatus" = true) "resourceAcceptedCount", (select COUNT(*) from candidate_hiring_steps_view where "positionStatusName" ilike (\'Resource rejected offer\') and "pStatus" = true) "resourceRejectedCount", (select COUNT(*) from candidate_hiring_steps_view where "positionStatusName" ilike (\'Ellow rejected offer\') and "pStatus" = true) "ellowRejectedCount" ) select * from src',
    candidateVetted_NonVettedCount : 'with counts as ( select ( select count(*) from candidate where candidate_vetted = 6 and candidate_status =3 and status=true ) as "vettedCount", ( select count(*) from candidate where candidate_vetted != 6 and candidate_vetted != 0 and candidate_status=3 and status=true ) as "nonVettedCount" ) select * from counts',
    ellowScreeningCount : 'with src as( select candidate_id, (case when candidate_vetted < 6 and candidate_vetted > 0 then (select stage_name from review_steps where review_steps_id = candidate_vetted) when candidate_vetted = 6 then case when 0 = (select assessment_rating from candidate_assesement cas where ca.candidate_id = cas.candidate_id and cas.assesment_type = 4) then \'Vetted\' else \'ellow Certified And Vetted\' end when candidate_vetted = 0 then \'Rejected\' else \'Profile Screening\' end) as "stageName" from candidate ca where status = true and candidate_status = 3 ) select count(*),"stageName" from src group by "stageName"',
    fetchRecruiterInterviewList:"select concat(c.candidate_first_name,' ',c.candidate_last_name) as name,c.candidate_id as candidateId,concat(e.firstname,' ',e.lastname) as assignedTo,chs.step_start_date as stepStartDate,chs.status,p.position_name as positionName,p.position_id as positionId from candidate_client_hiring_step chs inner join employee e on e.employee_id=chs.assigned_to  inner join candidate c on c.candidate_id=chs.candidate_id inner join positions p on p.position_id=chs.position_id where chs.candidate_hiring_step_name='Discussion with resource' and chs.step_status=1 and chs.status=true ",
    fetchHirerInterviewList:"select concat(c.candidate_first_name,' ',c.candidate_last_name) as name,c.candidate_id as candidateId,concat(e.firstname,' ',e.lastname) as assignedTo,chs.step_start_date as stepStartDate,chs.status,p.position_name as positionName,p.position_id as positionId from candidate_client_hiring_step chs inner join employee e on e.employee_id=chs.assigned_to  inner join candidate c on c.candidate_id=chs.candidate_id inner join positions p on p.position_id=chs.position_id where p.company_id=$1 and chs.candidate_hiring_step_name='Discussion with resource' and chs.step_status=1 and chs.status=true ",
    fetchAllActivePositionsForEllowRecruiter:'select position_name as "positionName", position_id as "positionId", developer_count as "developerCount", company_name as "companyName" from positions p left join company c on p.company_id = c.company_id where job_status = 6 and p.status = true ',
    fetchAllActivePositionsForHirer:'select p.position_name as "positionName", p.position_id as "positionId", p.developer_count as "developerCount", c.company_name as "companyName" from positions p left join company c on p.company_id = c.company_id where p.company_id = $1 and p.job_status = 6 and p.status = true '
}