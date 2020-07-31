export default {
    getCompanyCertifications: 'SELECT company_certification_id AS "companyCertificationId", certificate_id AS "certificateId", certificate_number AS "CertificationNumber", logo, document AS "certificationDocument", certification_type AS "CertificationType"  FROM company_certifications WHERE company_id  = $1 AND status = true ORDER BY 1 DESC',
    addCompanyCertifications: "INSERT INTO company_certifications( company_id, certificate_id, certificate_number, logo, document, status, created_on, certification_type) VALUES ($1, $2, $3, $4, $5, true, $6, $7)",
    updateCompanyCertifications:  "UPDATE company_certifications SET company_id = $1, certificate_id = $2, certificate_number = $3, logo = $4, document = $5, updated_on = $6, certification_type = $7 WHERE company_certification_id = $8",
    deleteCompanyCertifications:"UPDATE company_certifications SET status = false, updated_on = $1 WHERE company_certification_id = $2"
}