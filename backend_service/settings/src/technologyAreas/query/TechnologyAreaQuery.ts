export default {
    getTechnologyAreas: `select technology_area_id as "technologyAreaId", technology_name as "technologyName" from  technology_areas where status = true`,
    createTechnologyArea: "INSERT into technology_areas (technology_name,created_on ,updated_on ) values ($1 ,$2,$2 );",
    updateTechnologyArea: `update technology_areas set technology_name = $1, updated_on = $2 where technology_area_id = $3 and status = true`,
    deleteTechnologyArea: `update technology_areas set status = false,updated_on = $1 where technology_area_id = $2`
}