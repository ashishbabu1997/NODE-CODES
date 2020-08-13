export default {
    getSkills: `select skill_id as "skillId", skill_name as "skillName" from  skills where status = true`,
    createSkills: "INSERT into skills (skill_name,created_on ,updated_on ) values ($1 ,$2,$2 );",
    updateSkills: `update skills set skill_name = $1, updated_on = $2 where skill_id = $3 and status = true`,
    deleteSkills: `update skills set status = false,updated_on = $1 where skill_id = $2`
}