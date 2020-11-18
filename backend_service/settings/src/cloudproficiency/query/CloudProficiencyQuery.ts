export default {
    fetchCloudProficiency: `select cloud_proficiency_id as "cloudProficiencyId",proficiency_name as "cloudProficiencyName" from cloud_proficiency where status = true`,
    createNewCloudProficiency: "INSERT into cloud_proficiency (proficiency_name,created_on,updated_on) values ($1, $2, $2);",
    modifyCloudProficiency: `update cloud_proficiency set proficiency_name = $2, updated_on = $3, status = true where cloud_proficiency_id = $1`,
    removeCloudProficiency: `update cloud_proficiency set status = false, updated_on = $2 where cloud_proficiency_id = $1`
}