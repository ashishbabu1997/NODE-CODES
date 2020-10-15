export default {
    getSkills: `select s.skill_id as "skillId", s.skill_name as "skillName",s.top_rated as "topRated" from  skills s left join job_category_skills jcs on jcs .skill_id = s.skill_id and jcs.status = true where jcs.job_category_id = $1 and s.status  = true`,
    createSkills: "INSERT into skills (skill_name,created_on ,updated_on ) values ($1,$2,$2 ) ON CONFLICT ON CONSTRAINT skills_skill_name_status_key DO UPDATE SET skill_name = $1 RETURNING skill_id ;",
    updateSkills: `update skills set skill_name = $1, job_category_id = $4, updated_on = $2 where skill_id = $3 and status = true`,
    deleteSkills: `update skills set status = false,updated_on = $1 where skill_id = $2`,
    addJobCategorySkills:`Insert into job_category_skills (job_category_id,skill_id,created_on,updated_on) values ($1,$2,$3,$3)`,
    getSkillsWithoutId:`select s.skill_id as "skillId", s.skill_name as "skillName",s.top_rated as "topRated" from  skills s left join job_category_skills jcs on jcs .skill_id = s.skill_id and jcs.status = true where s.status  = true`,
}

