export default {
    getCompanyCertifications: "SELECT * FROM company_certifications WHERE company_id  = $1 AND status = true ORDER BY 1 DESC",
    addCompanyCertifications: "INSERT INTO company_certifications( company_id, certificate_id, certificate_number, logo, document, status, created_on) VALUES ($1, $2, $3, $4, $5, true, $6)",
    updateCompanyCertifications:  "UPDATE company_certifications SET company_id = $1, certificate_id = $2, certificate_number = $3, logo = $4, document = $5, updated_on = $6 WHERE company_certification_id = $7",
    deleteCompanyCertifications:"UPDATE company_certifications SET status = false, updated_on = $1 WHERE company_certification_id = $2"
}