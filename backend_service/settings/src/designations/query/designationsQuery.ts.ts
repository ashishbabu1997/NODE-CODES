export default {
    fetchDesignations:'select json_agg(a.candidate_position_name)  as designations from (select distinct candidate_position_name from candidate where candidate_position_name is not null and candidate_position_name != \'\' order by candidate_position_name) as a',
}