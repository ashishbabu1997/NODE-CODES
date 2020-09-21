export default {
    getAssessmentTraits: `select review_steps_id as "assessmentTraitsId",review_name as "assessmentTraitsName" from  review_steps where status = true`,
    createAssessmentTraits: "INSERT into review_steps (review_name,created_on ,updated_on ) values ($1 ,$2,$2 );",
    updateAssessmentTraits: `update review_steps set review_name = $1, updated_on = $2 where review_steps_id = $3 and status = true;`,
    deleteAssessmentTraits: `update review_steps set status = false,updated_on = $1 where review_steps_id = $2`
}