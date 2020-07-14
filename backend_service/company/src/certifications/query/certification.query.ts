export default {
    getCompanyCertifications: "SELECT * FROM company_certifications WHERE company_id  = $1 AND status = true ORDER BY 1 DESC",
    addCompanyCertifications: "INSERT INTO company_certifications( company_id, certificate_id, certificate_number, logo, document, status, created_on) VALUES ($1, $2, $3, $4, $5, true, LOCALTIMESTAMP)",
    updateCompanyCertifications:  "UPDATE company_certifications SET company_id = $1, certificate_id = $2, certificate_number = $3, logo = $4, document = $5, updated_on = LOCALTIMESTAMP WHERE company_certification_id = $6",
    deleteCompanyCertifications:"UPDATE company_certifications SET status = false, updated_on = LOCALTIMESTAMP WHERE company_certification_id = $1"
}