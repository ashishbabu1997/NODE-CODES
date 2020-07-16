export default {
    getCompanyHiringSteps: "select hs.hiring_step_id ,hs.hiring_step_name ,hs.description ,hsg.hiring_stage_id ,hsg.hiring_stage_name ,hsg.hiring_stage_order ,hsg.description as hiring_stage_description from hiring_steps hs left join hiring_stages hsg on hsg.hiring_step_id = hs.hiring_step_id and hsg.status = true where hs.status = true and hs.company_id = $1",
    addHiringSteps: `INSERT into hiring_steps (company_id,hiring_step_name,description,created_on,updated_on) values ($1,$2,$3,$4,$5) RETURNING hiring_step_id`,
    addHiringStages: `INSERT into hiring_stages (hiring_stage_name,description,hiring_step_id,hiring_stage_order,created_on,updated_on) values `,
    editHiringSteps: `UPDATE hiring_steps SET hiring_step_name=$2, description=$3,updated_on=$4 WHERE hiring_step_id=$1;`,
    editHiringStagesStart: `update hiring_stages as hsg set hiring_stage_order = c.hiring_stage_order, hiring_stage_name = c.hiring_stage_name , description = c.description, updated_on = c.updated_on from ( values `,
    editHiringStagesEnd:`) as c (hiring_stage_id,hiring_stage_name,description, hiring_stage_order,updated_on) where c.hiring_stage_id = hsg.hiring_stage_id`
}