export default {
    get_details:"SELECT * FROM company WHERE id = ($1)",
    update_details:"UPDATE company SET company_name=$1,company_website = $2,company_size=$3 WHERE company_id=$4"
}